import { getWeeks } from "../lib/date.js";
import { WEEKDAYS } from "../constants.js";
import { useSchedule } from "../context/ScheduleContext.jsx";
import DayModal from "./DayModal.jsx";
import Sidebar from "./Sidebar.jsx";
import CalendarCell from "./CalendarCell.jsx";
import ChildManageModal from "./ChildManageModal.jsx";
import CalendarNav from "./CalendarNav.jsx";

const Calendar = () => {
  const { year, month, selectedDate, isChildModalOpen } = useSchedule();

  const weeks = getWeeks(year, month);

  return (
    <>
      <div className="flex items-start gap-4 max-[980px]:flex-col">
        <div className="border-line min-w-0 flex-1 rounded-[18px] border bg-white px-3 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <CalendarNav />

          <table className="w-full table-fixed border-separate border-spacing-1.5">
            <thead>
              <tr>
                {WEEKDAYS.map((day) => (
                  <th
                    key={day}
                    className="text-ink-soft rounded-lg bg-[#f6f2ea] py-2.25 font-semibold"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((date, dateIndex) => (
                    <CalendarCell key={dateIndex} date={date} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Sidebar />
      </div>

      {selectedDate && <DayModal />}

      {isChildModalOpen && <ChildManageModal />}
    </>
  );
};

export default Calendar;
