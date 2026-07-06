"use client";

interface Props {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hint?: boolean;
  onClick: () => void;
}

/** 背景画像の上に％配置するクリック領域 */
export default function Hotspot({ label, x, y, w, h, hint, onClick }: Props) {
  return (
    <button
      className="hotspot"
      aria-label={label}
      onClick={onClick}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      }}
    >
      {hint && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--accent2)", animation: "blink 1.5s infinite" }}
        />
      )}
    </button>
  );
}
