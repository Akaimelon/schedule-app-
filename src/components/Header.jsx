import { useSchedule } from "../context/ScheduleContext.jsx";
import { CopyIcon, UsersIcon, PrintIcon } from "./Icon.jsx";
import house from "../assets/house_icon.png";

const Header = () => {
  const { setIsChildModalOpen, copyPreviousMonth } = useSchedule();

  const handleCopy = () => {
    if (window.confirm("先月の予定を今月にコピーしますか？")) {
      copyPreviousMonth();
    }
  };

  const baseBtnClass =
    "inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.75 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-120";

  const softBtnClass =
    "border border-line-btn font-medium text-[#56524b] hover:border-[#e0d9cc] hover:bg-[#fbf8f2]";

  const primaryBtnClass =
    "border-[1.5px] border-[#6ea8dc] font-semibold text-[#4a86c4] hover:bg-[#f3f8fd]";

  return (
    <header className="mb-5.5 flex items-start justify-between gap-6 max-[980px]:flex-col max-[980px]:items-stretch">
      <div className="flex items-center gap-4">
        <img src={house} alt="" className="h-15 w-15 shrink-0 object-contain" />
        <div>
          <div className="text-ink-strong text-[28px] font-extrabold tracking-[1px] whitespace-nowrap">
            ひまわり予定表
          </div>
          <div className="text-ink-muted mt-1 text-sm">
            月間スケジュールを管理し、子どもたちの利用状況を把握しましょう
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className={`${baseBtnClass} ${softBtnClass}`}
          onClick={handleCopy}
        >
          <CopyIcon />
          先月の日程をコピー
        </button>
        <button
          className={`${baseBtnClass} ${softBtnClass}`}
          onClick={() => window.print()}
        >
          <PrintIcon />
          印刷
        </button>
        <button
          className={`${baseBtnClass} ${primaryBtnClass}`}
          onClick={() => setIsChildModalOpen(true)}
        >
          <UsersIcon />
          子供管理
        </button>
      </div>
    </header>
  );
};

export default Header;
