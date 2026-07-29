import { useSchedule } from "../context/ScheduleContext.jsx";
import { ChevronLeft, ChevronRight } from "./Icon.jsx";

const CalendarNav = () => {
  const { year, month, prevMonth, nextMonth } = useSchedule();

  const btnCss =
    "inline-flex items-center gap-1 border-line-btn cursor-pointer rounded-[10px] border bg-white px-3.75 py-2 text-sm font-medium text-[#6b665d] transition-colors duration-120 hover:bg-[#fbf8f2]";

  return (
    <div className="mb-3 flex items-center justify-between gap-2.5 px-2 py-1">
      <button className={btnCss} onClick={prevMonth}>
        <ChevronLeft />
        前月
      </button>
      <div className="text-ink-strong text-center text-[26px] font-extrabold tracking-[1px]">
        {`${year}年 ${month + 1}月`}
      </div>

      <button className={btnCss} onClick={nextMonth}>
        翌月
        <ChevronRight />
      </button>
    </div>
  );
};

export default CalendarNav;
