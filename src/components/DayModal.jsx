import { useRef } from "react";
import { toStr } from "../lib/date.js";
import { useSchedule } from "../context/ScheduleContext.jsx";
import { MAX_PER_DAY, TRANSPORT_OPTIONS, WEEKDAYS } from "../constants.js";

const TOGGLE_ACTIVE = {
  am: "border-[#7cc1e8] bg-[#e2f3fc] text-[#2a7fb0]",
  pm: "border-[#e9a668] bg-[#fcebd6] text-[#c2742a]",
  pickup: "border-[#bbd8f0] bg-[#e3f0fb] text-[#3f82c6]",
  dropoff: "border-[#bbe0c8] bg-[#e4f3e8] text-[#4e9a5c]",
};

const TOGGLE_BOX_ACTIVE = {
  am: "border-[#2a7fb0] bg-[#2a7fb0] text-white",
  pm: "border-[#c2742a] bg-[#c2742a] text-white",
  pickup: "border-[#3f82c6] bg-[#3f82c6] text-white",
  dropoff: "border-[#4e9a5c] bg-[#4e9a5c] text-white",
};

const DayModal = () => {
  const {
    selectedDate,
    setSelectedDate,
    childList,
    schedule,
    toggleChild,
    toggleOption,
  } = useSchedule();

  const date = selectedDate;
  const attendance = schedule[toStr(selectedDate)] || {};
  const onClose = () => setSelectedDate(null);
  const full = Object.keys(attendance).length >= MAX_PER_DAY;
  const pressedOnOverlay = useRef(false);

  return (
    <div
      className="fixed inset-0 z-500 flex items-center justify-center bg-[rgba(60,52,40,0.32)] p-4"
      onPointerDown={(e) => {
        pressedOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressedOnOverlay.current) onClose();
      }}
    >
      <div className="border-line flex max-h-[88vh] w-157.5 max-w-[calc(100vw-32px)] flex-col rounded-[18px] border bg-white shadow-[0_12px_40px_rgba(60,52,40,0.18)]">
        <div className="border-line flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div className="text-ink-strong text-[17px] font-extrabold">
            {`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay() - 1]}）`}
          </div>
          <button
            className="text-ink-muted hover:text-ink cursor-pointer border-none bg-transparent p-0 text-[22px] leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-ink-soft mb-2 text-xs font-bold">
            来る子を選択
          </div>
          {childList
            .filter((child) => !full || attendance[child.id])
            .map((child) => {
              const isSelected = Boolean(attendance[child.id]);
              return (
                <div
                  key={child.id}
                  className={`mb-1.5 flex items-center gap-2.5 rounded-xl border px-3.25 py-2.75 transition-colors duration-100 ${
                    isSelected ? "border-[#6ea8dc] bg-[#eaf2fb]" : "border-line"
                  }`}
                >
                  <div
                    className={`mr-auto flex min-w-0 cursor-pointer items-center gap-2.25 rounded-lg p-1 select-none ${
                      isSelected ? "" : "hover:bg-panel2"
                    }`}
                    onClick={() => toggleChild(child.id)}
                  >
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-xs leading-none text-white ${
                        isSelected
                          ? "border-accent bg-accent"
                          : "border-line-btn bg-white"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    <span
                      className="truncate text-sm font-semibold"
                      style={{ color: child.color }}
                    >
                      {child.name}
                    </span>
                  </div>

                  <div className="inline-flex flex-wrap items-center gap-1.5">
                    {TRANSPORT_OPTIONS.map((opt) => {
                      const isOn = attendance[child.id]?.[opt.key];
                      return (
                        <button
                          disabled={!isSelected}
                          key={opt.key}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.25 text-[11px] font-semibold select-none ${
                            attendance[child.id]?.[opt.key]
                              ? TOGGLE_ACTIVE[opt.key]
                              : "border-line-btn bg-white"
                          } ${isSelected ? "cursor-pointer" : "cursor-not-allowed opacity-55"}`}
                          onClick={() => toggleOption(child.id, opt.key)}
                        >
                          <span
                            className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-1 border text-[10px] leading-none ${
                              isOn
                                ? TOGGLE_BOX_ACTIVE[opt.key]
                                : "border-current bg-transparent"
                            }`}
                          >
                            {isOn ? "✓" : ""}
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DayModal;
