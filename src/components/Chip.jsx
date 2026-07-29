import { TRANSPORT_OPTIONS } from "../constants.js";

const MARK_STYLE = {
  pickup: "bg-[#edf5ff] border-[#c9def7] text-[#0c447c]", 
  dropoff: "bg-[#e8f5ee] border-[#cbe6d7] text-[#0f5132]", 
};

const Chip = ({ child, opts }) => {
  return (
    <div
      className="mt-0.75 flex max-w-full items-center rounded-lg border px-1.5 py-0.5 text-sm font-bold"
      style={{
        color: child?.color,
        background: opts.am ? "#E2F3FC" : opts.pm ? "#FCEBD6" : "#fff",
        borderColor: opts.am ? "#7CC1E8" : opts.pm ? "#E9A668" : "#d0d5db",
      }}
    >
      <span className="min-w-0 truncate">{child?.name}</span>
      {TRANSPORT_OPTIONS.filter(
        (opt) =>
          (opt.key === "pickup" || opt.key === "dropoff") && opts[opt.key],
      ).map((opt) => (
        <span
          key={opt.key}
          className={`ml-0.75 inline-flex h-4.25 w-4.25 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none font-bold ${MARK_STYLE[opt.key]}`}
        >
          {opt.mark}
        </span>
      ))}
    </div>
  );
};

export default Chip;
