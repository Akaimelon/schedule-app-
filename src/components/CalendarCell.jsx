import Chip from "./Chip.jsx";
import { useSchedule } from "../context/ScheduleContext.jsx";
import { toStr } from "../lib/date.js";

const CalendarCell = ({ date }) => {
  const { schedule, childList, setSelectedDate, holidays } = useSchedule();

  const dayAttendance = date ? schedule[toStr(date)] || {} : {};
  const ids = Object.keys(dayAttendance);

  const today = new Date();
  const isToday = date && toStr(date) === toStr(today);

  const holidayName = date ? holidays[toStr(date)] : undefined;

  const toneTodayHolodayClass = isToday
    ? "border-[#ead9a0] bg-[#fdf8e6]"
    : holidayName
      ? "border-line bg-[#fff9fa]"
      : "border-line bg-white";

  const cellClass = `rounded-[14px] border align-top ${
    date
      ? `min-h-30 cursor-pointer px-1.5 py-2 transition-[box-shadow,border-color] duration-120 hover:border-[#dcd3c2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] 
         ${toneTodayHolodayClass}`
      : "cursor-default border-dashed border-[#eae3d5] bg-[#fbf8f2]"
  } `;

  return (
    <td className={cellClass} onClick={() => date && setSelectedDate(date)}>
      {date && (
        <>
          <span
            className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-[13px] font-bold ${
              isToday ? "bg-[#5c97d8] text-white" : "text-[#454541]"
            }`}
          >
            {date.getDate()}
          </span>
          {holidayName && (
            <span className="mb-1 inline-flex max-w-full items-center truncate rounded-full border border-[#fecdd3] bg-[#fff1f2] px-1.5 py-px text-[10px] text-[#b42318]">
              {holidayName}
            </span>
          )}
          <div className="mt-0.75 grid grid-cols-2 items-start gap-x-1 gap-y-0.5">
            {ids.map((id) => (
              <Chip
                key={id}
                child={childList.find((c) => c.id === Number(id))}
                opts={dayAttendance[id] || {}}
              />
            ))}
          </div>
        </>
      )}
    </td>
  );
};

export default CalendarCell;
