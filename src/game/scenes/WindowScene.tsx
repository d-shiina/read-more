"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function WindowScene() {
  const { state, say, setFlag } = useGame();
  const open = state.flags.curtainOpen;

  return (
    <SceneSvg>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd9a0" />
          <stop offset="55%" stopColor="#ff9ec4" />
          <stop offset="100%" stopColor="#8fb6ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />

      {/* frame */}
      <rect x="200" y="60" width="600" height="500" rx="10" fill="#0a0715" stroke="#2a2140" strokeWidth="10" />

      {!open ? (
        <Hotspot
          label="カーテンを開ける"
          onClick={() => {
            setFlag("curtainOpen");
            say("重いカーテンを開けると、朝日が差し込んだ。ガラスの曇りに指でなぞった跡が —— 「7」。");
          }}
          x={210}
          y={70}
          w={580}
          h={480}
          hint
        >
          <rect x="210" y="70" width="290" height="480" fill="#3a2a5e" />
          <rect x="500" y="70" width="290" height="480" fill="#33254f" />
          {/* curtain folds */}
          {[240, 300, 360, 420, 470].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="550" stroke="#2a1d47" strokeWidth="10" />
          ))}
          {[540, 600, 660, 720, 760].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="550" stroke="#241a3e" strokeWidth="10" />
          ))}
        </Hotspot>
      ) : (
        <>
          <rect x="210" y="70" width="580" height="480" fill="url(#sky)" />
          {/* distant city */}
          <g fill="#7a6ba0" opacity="0.55">
            <rect x="230" y="360" width="60" height="190" />
            <rect x="300" y="300" width="50" height="250" />
            <rect x="360" y="400" width="70" height="150" />
            <rect x="560" y="330" width="55" height="220" />
            <rect x="630" y="390" width="80" height="160" />
            <rect x="720" y="350" width="50" height="200" />
          </g>
          {/* sun */}
          <circle cx="620" cy="200" r="55" fill="#fff2cf" opacity="0.9" />
          {/* window cross */}
          <line x1="500" y1="70" x2="500" y2="550" stroke="#0a0715" strokeWidth="10" />
          <line x1="210" y1="310" x2="790" y2="310" stroke="#0a0715" strokeWidth="10" />
          {/* the traced number in the dust */}
          <text
            x="330"
            y="200"
            fill="#ffffff"
            fontSize="90"
            fontWeight="800"
            opacity="0.5"
            style={{ fontFamily: "cursive" }}
          >
            7
          </text>
        </>
      )}

      <text x="500" y="605" textAnchor="middle" fill="#9a90bd" fontSize="18">
        {open ? "曇りガラスに「7」の跡。" : "分厚いカーテンが陽の光を遮っている。"}
      </text>
    </SceneSvg>
  );
}
