import { useSchedule } from "../context/ScheduleContext.jsx";
import { getWeeks, toStr } from "../lib/date.js";
import { WEEKDAYS, TRANSPORT_OPTIONS } from "../constants.js";

const PrintView = () => {
  const { year, month, schedule, childList, holidays } = useSchedule();
  const weeks = getWeeks(year, month);
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const countForChild = (id) =>
    Object.entries(schedule).filter(
      ([dateStr, day]) => dateStr.startsWith(monthPrefix) && day[id],
    ).length;

  const PRINT_MARK_STYLE = {
    pickup: "border-[#c9def7] bg-[#edf5ff] text-[#0c447c]",
    dropoff: "border-[#cbe6d7] bg-[#e8f5ee] text-[#0f5132]",
  };

  const tdClass = "border-[0.5pt] border-[#aaa] px-1.5 py-1";
  const thClass =
    "border-[0.5pt] border-[#aaa] bg-white p-1 text-[9pt] font-medium";

  return (
    <div
      className="hidden text-[#222] print:block"
      style={{
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        fontFamily: "'Hiragino Kaku Gothic ProN', 'MS Gothic', sans-serif",
      }}
    >
      <div className="mb-[10pt] text-center text-[13pt] font-bold tracking-[0.03em]">
        ひまわり予定表 {year}年{month + 1}月
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day} className={thClass}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                const dayAttendance = date ? schedule[toStr(date)] || {} : {};
                const ids = Object.keys(dayAttendance);
                const holidayName = date ? holidays[toStr(date)] : undefined;

                const rank = (id) => {
                  const o = dayAttendance[id] || {};
                  return o.am ? 0 : o.pm ? 1 : 2;
                };
                const sortedIds = [...ids].sort((a, b) => rank(a) - rank(b));

                return (
                  <td
                    key={di}
                    className={`h-[88pt] w-[20%] border-[0.5pt] border-[#aaa] px-1 py-0.75 align-top ${holidayName ? "bg-[#fff9fa]" : ""}`}
                  >
                    {date && (
                      <>
                        <div
                          className={`mb-1 text-[9pt] font-bold ${holidayName ? "text-[#b42318]" : ""}`}
                        >
                          {date.getDate()}
                        </div>
                        {holidayName && (
                          <div className="mb-0.5 inline-block max-w-full truncate rounded-full border-[0.5pt] border-[#fecdd3] bg-[#fff1f2] px-1 text-[7pt] text-[#b42318]">
                            {holidayName}
                          </div>
                        )}
                        <div className="grid grid-cols-2 items-start gap-x-1 gap-y-[2pt]">
                          {sortedIds.map((id) => {
                            const opts = dayAttendance[id] || {};

                            const child = childList.find(
                              (c) => c.id === Number(id),
                            );

                            return (
                              <div
                                key={id}
                                className="rounded-[3px] border-[0.5pt] px-1 py-px text-[7.5pt] leading-tight font-bold"
                                style={{
                                  color: child?.color,
                                  background: opts.am
                                    ? "#E2F3FC"
                                    : opts.pm
                                      ? "#FCEBD6"
                                      : "#fff",
                                  borderColor: opts.am
                                    ? "#7CC1E8"
                                    : opts.pm
                                      ? "#E9A668"
                                      : "#d0d5db",
                                }}
                              >
                                {child?.name}
                                {TRANSPORT_OPTIONS.filter(
                                  (o) =>
                                    (o.key === "pickup" ||
                                      o.key === "dropoff") &&
                                    opts[o.key],
                                ).map((o) => (
                                  <span
                                    key={o.key}
                                    className={`ml-0.5 inline-flex h-[11pt] min-w-[11pt] items-center justify-center rounded-full border-[0.5pt] px-[2.5pt] text-[6pt] leading-none font-bold ${PRINT_MARK_STYLE[o.key]}`}
                                  >
                                    {o.mark}
                                  </span>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="break-before-page">
        <table className="w-68 border-collapse text-[13px]">
          <thead>
            <tr>
              {["利用者", "契約", "利用", "残"].map((h) => (
                <th
                  key={h}
                  className={`border-[0.5pt] border-[#aaa] px-2 py-1.5 font-medium text-[#4b5563] ${h === "利用者" ? "text-left" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {childList.map((child) => {
              const used = countForChild(child.id);
              const contract = child.contractDays ?? 0;
              const rem = contract - used;
              return (
                <tr key={child.id}>
                  <td className={tdClass} style={{ color: child.color }}>
                    {child.name}
                  </td>
                  <td className={`${tdClass} text-center`}>{contract}</td>
                  <td className={`${tdClass} text-center`}>{used}</td>
                  <td
                    className={`${tdClass} text-center`}
                    style={{ color: rem < 0 ? "#c44040" : undefined }}
                  >
                    {rem}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintView;
