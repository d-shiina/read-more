"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function PosterScene() {
  const { state, say, setFlag } = useGame();
  const peeled = state.flags.posterPeeled;

  return (
    <SceneSvg>
      <defs>
        <linearGradient id="posterBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a1650" />
          <stop offset="100%" stopColor="#120a24" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />

      {/* the poster */}
      <rect x="280" y="50" width="440" height="540" fill="url(#posterBg)" stroke="#3a2a5e" strokeWidth="6" />
      <text x="500" y="200" textAnchor="middle" fill="#b46bff" fontSize="80" fontWeight="800">
        革命
      </text>
      <text x="500" y="250" textAnchor="middle" fill="#4be3ff" fontSize="26" letterSpacing="6">
        REVOLUTION
      </text>
      <text x="500" y="300" textAnchor="middle" fill="#9a90bd" fontSize="15">
        —— 世界を、君の手で塗り替えろ ——
      </text>
      {/* stylized figure */}
      <circle cx="500" cy="400" r="45" fill="#ffd166" opacity="0.9" />
      <rect x="455" y="435" width="90" height="120" rx="12" fill="#b46bff" opacity="0.85" />

      {/* peel corner hotspot */}
      <Hotspot
        label="めくれたポスターの角"
        onClick={() => {
          setFlag("posterPeeled");
          say("ポスターの右上の角をめくると、壁に油性ペンで走り書き —— 「9」。");
        }}
        x={640}
        y={50}
        w={90}
        h={90}
        hint
      >
        {!peeled ? (
          <path d="M700 50 L720 50 L720 70 Z" fill="#4a3570" stroke="#5a4585" strokeWidth="2" />
        ) : (
          <>
            {/* revealed wall + number */}
            <path d="M660 50 L720 50 L720 110 Z" fill="#0c0817" stroke="#3a2a5e" strokeWidth="2" />
            <text x="690" y="98" textAnchor="middle" fill="#ff5d7a" fontSize="34" fontWeight="800" style={{ fontFamily: "cursive" }}>
              9
            </text>
          </>
        )}
      </Hotspot>

      <text x="500" y="620" textAnchor="middle" fill="#9a90bd" fontSize="18">
        {peeled ? "壁に走り書きの「9」。" : "色あせた『革命』の宣伝ポスター。右上の角が少しめくれている。"}
      </text>
    </SceneSvg>
  );
}
