interface TopBarProps {
  onHome: () => void;
}

export function TopBar({ onHome }: TopBarProps) {
  return (
    <header className="top-bar">
      <button className="brand-button" type="button" onClick={onHome}>
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <span>数学练习乐园</span>
      </button>
      <button className="small-button" type="button" onClick={onHome}>
        回首页
      </button>
    </header>
  );
}
