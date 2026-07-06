"use client";

import { ReactNode, KeyboardEvent } from "react";

interface HotspotProps {
  label: string;
  onClick: () => void;
  /** transparent hit rectangle */
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
  /** show a soft pulsing marker to hint interactivity */
  hint?: boolean;
  disabled?: boolean;
}

/**
 * An accessible, clickable region inside an SVG scene.
 * The visible art passed as children glows on hover/focus (see .hotspot in CSS).
 */
export default function Hotspot({
  label,
  onClick,
  x,
  y,
  w,
  h,
  children,
  hint,
  disabled,
}: HotspotProps) {
  const handleKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) onClick();
    }
  };

  return (
    <g
      className={disabled ? undefined : "hotspot"}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKey}
    >
      {children}
      <rect x={x} y={y} width={w} height={h} fill="transparent" />
      {hint && !disabled && (
        <circle
          cx={x + w / 2}
          cy={y + h / 2}
          r={9}
          fill="var(--neon2)"
          style={{ animation: "pulseGlow 1.6s ease-in-out infinite" }}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
