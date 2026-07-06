"use client";

import { ReactNode } from "react";

/** Shared responsive SVG frame. All scenes draw on a 1000x640 canvas. */
export default function SceneSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1000 640"
      className="anim-fade block w-full h-auto select-none"
      style={{ aspectRatio: "1000 / 640" }}
      role="img"
    >
      {children}
    </svg>
  );
}
