import { useState, useEffect, useRef } from "react";
import { toStr, getWeekdayOccurrence, findNthWeekday } from "../lib/date.js";
import { CHILD_COLORS, HOLIDAY_API, MAX_PER_DAY, STORAGE_KEY, SAMPLE_CHILDREN } from "../constants.js";
import { ScheduleContext } from "./ScheduleContext.jsx";

export const ScheduleProvider = ({ children }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [childList, setChildList] = useState([]);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [holidays, setHolidays] = useState({});
  const isLocalMode = useRef(false);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  //サーバーからの読み込み完了後に保存を行うためのガード
  const handleTriggeredSend = async (nextSchedule, nextChildList) => {
    if (isLocalMode.current) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ schedule: nextSchedule, childList: nextChildList }),
      );
      return;
    }
    await fetch("/api/save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        schedule: nextSchedule,
        childList: nextChildList,
      }),
    });
  };

  const toggleChild = (childId) => {
    const key = toStr(selectedDate);
    const day = { ...(schedule[key] ?? {}) };
    if (day[childId]) {
      delete day[childId];
    } else {
      if (Object.keys(day).length >= MAX_PER_DAY) return;
      const child = childList.find((c) => c.id === childId);
      const opts =
        child?.defaultTimeFrame === "am"
          ? { am: true }
          : child?.defaultTimeFrame === "pm"
            ? { pm: true }
            : {};

      day[childId] = opts;
    }
    const nextSchedule = { ...schedule, [key]: day };
    setSchedule(nextSchedule);
    handleTriggeredSend(nextSchedule, childList);
  };

  const toggleOption = (childId, optionKey) => {
    const key = toStr(selectedDate);
    const day = { ...(schedule[key] ?? {}) };
    const opts = { ...(day[childId] ?? {}) };
    opts[optionKey] = !opts[optionKey];
    if (optionKey === "am" && opts.am) opts.pm = false;
    if (optionKey === "pm" && opts.pm) opts.am = false;
    day[childId] = opts;
    const nextSchedule = { ...schedule, [key]: day };
    setSchedule(nextSchedule);
    handleTriggeredSend(nextSchedule, childList);
  };

  const addChild = ({ color, name, contractDays, defaultTimeFrame }) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newId = Math.max(0, ...childList.map((c) => c.id)) + 1;
    const nextChildList = [
      ...childList,
      {
        id: newId,
        name: trimmed,
        color: color || CHILD_COLORS[0],
        contractDays,
        defaultTimeFrame,
      },
    ];
    setChildList(nextChildList);
    handleTriggeredSend(schedule, nextChildList);
  };

  const deleteChild = (id) => {
    const nextChildList = childList.filter((c) => c.id !== id);
    const nextSchedule = Object.fromEntries(
      Object.entries(schedule).map(([dateStr, day]) => {
        const nextDay = { ...day };
        delete nextDay[id];
        return [dateStr, nextDay];
      }),
    );
    setChildList(nextChildList);
    setSchedule(nextSchedule);
    handleTriggeredSend(nextSchedule, nextChildList);
  };

  const updateChild = (id, changes) => {
    const nextChildList = childList.map((c) =>
      c.id === id ? { ...c, ...changes } : c,
    );
    setChildList(nextChildList);
    handleTriggeredSend(schedule, nextChildList);
  };

  const copyPreviousMonth = () => {
    const prev = new Date(year, month - 1, 1);
    const prevYear = prev.getFullYear();
    const prevMonth = prev.getMonth();
    const prevPrefix = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}`;

    const copied = {};
    Object.entries(schedule).forEach(([dateStr, day]) => {
      if (!dateStr.startsWith(prevPrefix)) return;
      const [y, m, d] = dateStr.split("-");
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      const weekday = date.getDay();
      const occurrence = getWeekdayOccurrence(date);
      const target = findNthWeekday(year, month, weekday, occurrence);
      if (!target) return;
      if (holidays[toStr(target)]) return;
      copied[toStr(target)] = day;
    });
    const nextSchedule = { ...schedule, ...copied };
    setSchedule(nextSchedule);
    handleTriggeredSend(nextSchedule, childList);
  };

  const reorderChild = (draggedId, targetId) => {
    if (draggedId === null || draggedId === targetId) return;
    const next = [...childList];
    const from = next.findIndex((c) => c.id === draggedId);
    const to = next.findIndex((c) => c.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setChildList(next);
    handleTriggeredSend(schedule, next);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/load.php");
        if (!res.ok) throw new Error(res.status);
        const json = await res.json();
        setSchedule(json.data.schedule || {});
        setChildList(json.data.childList || []);
      } catch {
        isLocalMode.current = true;
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        setSchedule(saved?.schedule || {});
        setChildList(saved?.childList || SAMPLE_CHILDREN);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const res = await fetch(`${HOLIDAY_API}/${year}/date.json`);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        setHolidays(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadHolidays();
  }, [year]);

  const value = {
    year,
    month,
    selectedDate,
    schedule,
    childList,
    isChildModalOpen,
    holidays,
    setSelectedDate,
    setIsChildModalOpen,
    prevMonth,
    nextMonth,
    toggleChild,
    toggleOption,
    addChild,
    deleteChild,
    updateChild,
    copyPreviousMonth,
    reorderChild,
  };
  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
