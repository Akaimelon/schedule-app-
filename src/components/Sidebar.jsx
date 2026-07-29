import { useSchedule } from "../context/ScheduleContext.jsx";
import { BarChartIcon } from "./Icon.jsx";
const SideBar = () => {
  const { childList, schedule, year, month } = useSchedule();

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

  const countForChild = (childId) =>
    Object.entries(schedule).filter(
      ([dateStr, day]) => dateStr.startsWith(monthPrefix) && day[childId],
    ).length;

  const totalContract = childList.reduce(
    (sum, c) => sum + (c.contractDays ?? 0),
    0,
  );
  const totalUsed = childList.reduce((sum, c) => sum + countForChild(c.id), 0);
  const totalRem = totalContract - totalUsed;

  const tdClass = "border-b border-[#f2eee5] px-2 py-3 text-center";
  const thClass =
    "border-b border-[#eee9df] bg-white px-2 py-3 text-center text-[13px] font-semibold text-ink-soft text-ink-soft whitespace-nowrap";

  return (
    <div className="border-line w-72 shrink-0 rounded-[18px] border bg-white px-3.5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] max-[980px]:w-full">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="text-ink-strong inline-flex items-center gap-1 text-[19px] font-extrabold">
          <BarChartIcon />
          利用状況
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-[#eee9df] text-sm [&_tbody_tr:last-child_td]:border-b-0">
        <thead>
          <tr>
            <th className={`${thClass} w-[52%] pl-3.5 text-left`}>利用者</th>
            <th className={`${thClass} w-[16%]`}>契約</th>
            <th className={`${thClass} w-[16%]`}>利用</th>
            <th className={`${thClass} w-[16%]`}>残</th>
          </tr>
        </thead>
        <tbody>
          {childList.map((child) => {
            const used = countForChild(child.id);
            const contract = child.contractDays ?? 0;
            const rem = contract - used;
            return (
              <tr key={child.id}>
                <td className={`${tdClass} pl-3.5 text-left`}>
                  <span className="flex min-w-0 items-center gap-2.25">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: child.color }}
                    />
                    <span className="truncate">{child.name}</span>
                  </span>
                </td>
                <td className={`${tdClass} text-ink-soft`}>{contract}</td>
                <td className={`${tdClass} font-semibold`}>{used}</td>
                <td
                  className={`${tdClass} ${
                    rem < 0
                      ? "font-semibold text-[#d75a5a]"
                      : rem === 0
                        ? "text-ink-soft"
                        : ""
                  }`}
                >
                  {rem}
                </td>
              </tr>
            );
          })}

          <tr className="[&>td]:bg-panel2 [&>td]:font-bold">
            <td className={`${tdClass} pl-3.5 text-left`}>合計</td>
            <td className={tdClass}>{totalContract}</td>
            <td className={tdClass}>{totalUsed}</td>
            <td className={tdClass}>{totalRem}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SideBar;
