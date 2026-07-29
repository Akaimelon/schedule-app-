import { useState, useRef } from "react";
import { useSchedule } from "../context/ScheduleContext.jsx";
import { TIME_OPTIONS, CHILD_COLORS } from "../constants.js";
import ColorSwatches from "./ColorSwatches.jsx";

const ChildManageModal = () => {
  const {
    childList,
    addChild,
    updateChild,
    deleteChild,
    setIsChildModalOpen,
    reorderChild,
  } = useSchedule();
  const onClose = () => setIsChildModalOpen(false);

  const [newName, setNewName] = useState("");
  const [newContract, setNewContract] = useState("");
  const [newTimeFrame, setNewTimeFrame] = useState("");
  const [dragId, setDragId] = useState(null);
  const [newColor, setNewColor] = useState(CHILD_COLORS[0]);
  const pressedOnOverlay = useRef(false);

  const addGridCols = "1.7fr 0.9fr 0.9fr 1.1fr auto";

  const gridCols = "30px minmax(110px,1fr) 84px 92px minmax(160px,1.8fr) 30px";
  const inputClass =
    "border-line-btn focus:border-accent h-9 w-full rounded-xl border bg-white px-3 text-sm outline-none";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addChild({
      name: newName,
      contractDays: Number(newContract) || 0,
      defaultTimeFrame: newTimeFrame,
    });
    setNewName("");
    setNewContract("");
    setNewTimeFrame("");
    setNewColor(CHILD_COLORS[0]);
  };

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
      <div className="border-line flex h-[min(88vh,940px)] w-[min(912px,100%)] max-w-[calc(100vw-32px)] min-w-70 flex-col rounded-[18px] border bg-white shadow-[0_12px_40px_rgba(60,52,40,0.18)]">
        <div className="border-line flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div className="text-ink-strong text-[17px] font-extrabold">
            子供管理
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
            新しい子を追加
          </div>
          <form
            onSubmit={handleSubmit}
            className="mb-4 grid items-center gap-2"
            style={{ gridTemplateColumns: addGridCols }}
          >
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="名前"
              className={inputClass}
            />
            <input
              type="number"
              value={newContract}
              onChange={(e) => setNewContract(Number(e.target.value))}
              placeholder="契約日数"
              className={inputClass}
            />
            <select
              value={newTimeFrame}
              onChange={(e) => setNewTimeFrame(e.target.value)}
              className={inputClass}
            >
              {TIME_OPTIONS.map((opt) => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <ColorSwatches value={newColor} onChange={setNewColor} />

            <button className="bg-accent h-9 shrink-0 cursor-pointer rounded-xl border-none px-4.5 text-sm font-semibold text-white">
              追加
            </button>
          </form>
          <div className="text-ink-soft mb-2 text-xs font-bold">
            登録済み（{childList.length}人）
          </div>
          {childList.length > 0 && (
            <div
              className="text-ink-soft mb-2 grid gap-2 px-3 text-[11px]"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div></div>
              <div>名前</div>
              <div>契約日数</div>
              <div>午前/午後</div>
              <div>名前色</div>
              <div></div>
            </div>
          )}

          <ul className="flex list-none flex-col gap-2">
            {childList.map((child) => (
              <li
                data-child-id={child.id}
                key={child.id}
                className={`${
                  dragId === child.id
                    ? "border-[#6ea8dc] bg-[#eaf2fb] shadow-[inset_0_0_0_1px_rgba(74,134,196,0.18)]"
                    : "border-line bg-white"
                } mb-2 grid items-center gap-2 rounded-xl border px-3 py-2.5`}
                style={{ gridTemplateColumns: gridCols }}
              >
                <div
                  className="text-ink-muted flex cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDragId(child.id);
                  }}
                  onPointerMove={(e) => {
                    if (dragId === null) return;
                    const el = document.elementFromPoint(e.clientX, e.clientY);
                    const row = el?.closest("[data-child-id]");
                    if (!row) return;
                    reorderChild(dragId, Number(row.dataset.childId));
                  }}
                  onPointerUp={() => setDragId(null)}
                >
                  ⋮⋮
                </div>
                <input
                  value={child.name}
                  onChange={(e) =>
                    updateChild(child.id, { name: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                  className={inputClass}
                />

                <input
                  type="number"
                  min="0"

                  value={child.contractDays ?? 0}
                  onChange={(e) =>
                    updateChild(child.id, {
                      contractDays: Number(e.target.value),
                    })
                  }

                  className={inputClass}
                />

                <select
                  value={child.defaultTimeFrame ?? ""}
                  onChange={(e) =>
                    updateChild(child.id, { defaultTimeFrame: e.target.value })
                  }
                  className={inputClass}
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ColorSwatches
                  value={child.color}
                  onChange={(color) => updateChild(child.id, { color })}
                />

                <button
                  className="text-ink-muted h-8 w-8 shrink-0 cursor-pointer rounded-md border-none bg-transparent text-base hover:bg-[#fbe9e9] hover:text-[#d75a5a]"
                  onClick={() => deleteChild(child.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line flex shrink-0 justify-end gap-2 border-t px-5 py-3.5">
          <button
            className="border-line-btn h-9.5 cursor-pointer rounded-xl border bg-white px-4 text-sm hover:bg-[#fbf8f2]"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildManageModal;
