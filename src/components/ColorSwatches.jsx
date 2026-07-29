import { CHILD_COLORS } from "../constants.js";

const ColorSwatches = ({ value, onChange }) => {
  return (
    <>
      <div className="flex min-h-7.5 flex-wrap items-center gap-1.25">
        {CHILD_COLORS.map((color) => (
          <button
            key={color}
            type="button"

            className={`h-6 w-6 cursor-pointer rounded-full border-2 border-transparent bg-clip-padding p-0 transition-[transform,box-shadow] duration-120 outline-none ${
              value === color
                ? "scale-[1.08] shadow-[0_0_0_2px_#fff,0_0_0_4px_#6ea8dc]"
                : ""
            }`}
            style={{ background: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </>
  );
};

export default ColorSwatches;
