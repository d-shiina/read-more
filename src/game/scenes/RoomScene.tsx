"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function RoomScene() {
  const { goto, say, state } = useGame();
  const f = state.flags;

  return (
    <SceneSvg>
      <defs>
        <radialGradient id="monitorGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#4be3ff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#7a4bff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160f26" />
          <stop offset="100%" stopColor="#0c0817" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0813" />
          <stop offset="100%" stopColor="#050409" />
        </linearGradient>
      </defs>

      {/* room shell */}
      <rect x="0" y="0" width="1000" height="470" fill="url(#wall)" />
      <rect x="0" y="470" width="1000" height="170" fill="url(#floor)" />
      <rect x="0" y="462" width="1000" height="10" fill="#1c1430" />
      {/* ambient monitor glow */}
      <rect x="330" y="120" width="380" height="380" fill="url(#monitorGlow)" />

      {/* WINDOW (back wall, left) */}
      <Hotspot label="窓" onClick={() => goto("window")} x={70} y={70} w={210} h={190}>
        <rect x="70" y="70" width="210" height="190" rx="6" fill="#0a0715" stroke="#2a2140" strokeWidth="4" />
        {f.curtainOpen ? (
          <>
            <rect x="80" y="80" width="190" height="170" fill="#243a5e" />
            <rect x="80" y="80" width="190" height="170" fill="#7fb2ff" opacity="0.25" />
            <line x1="175" y1="80" x2="175" y2="250" stroke="#0a0715" strokeWidth="6" />
            <line x1="80" y1="165" x2="270" y2="165" stroke="#0a0715" strokeWidth="6" />
          </>
        ) : (
          <>
            <rect x="76" y="76" width="94" height="178" fill="#3a2a5e" />
            <rect x="170" y="76" width="94" height="178" fill="#33254f" />
          </>
        )}
      </Hotspot>

      {/* POSTER (back wall, right) */}
      <Hotspot label="ポスター" onClick={() => goto("poster")} x={740} y={70} w={170} h={220}>
        <rect x="740" y="70" width="170" height="220" fill="#241640" stroke="#3a2a5e" strokeWidth="3" />
        <text x="825" y="150" textAnchor="middle" fill="#b46bff" fontSize="30" fontWeight="700">革命</text>
        <text x="825" y="185" textAnchor="middle" fill="#4be3ff" fontSize="13" letterSpacing="2">REVOLUTION</text>
        <rect x="775" y="205" width="100" height="60" fill="#3a2a5e" opacity="0.6" />
        {f.posterPeeled && <path d="M740 70 L770 70 L740 100 Z" fill="#0c0817" />}
      </Hotspot>

      {/* SHELF (right wall) */}
      <Hotspot label="本棚" onClick={() => goto("shelf")} x={840} y={300} w={140} h={180}>
        <rect x="840" y="300" width="140" height="180" fill="#1a1330" stroke="#2a2140" strokeWidth="3" />
        <line x1="840" y1="360" x2="980" y2="360" stroke="#2a2140" strokeWidth="3" />
        <line x1="840" y1="420" x2="980" y2="420" stroke="#2a2140" strokeWidth="3" />
        {/* cans */}
        <rect x="852" y="326" width="12" height="30" fill="#ff5d7a" />
        <rect x="868" y="326" width="12" height="30" fill="#ff5d7a" />
        <rect x="884" y="326" width="12" height="30" fill="#ff5d7a" />
        <rect x="900" y="326" width="12" height="30" fill="#ff5d7a" />
        {/* manga */}
        <rect x="852" y="372" width="9" height="40" fill="#4be3ff" />
        <rect x="863" y="372" width="9" height="40" fill="#b46bff" />
        <rect x="874" y="372" width="9" height="40" fill="#ffd166" />
        <rect x="885" y="372" width="9" height="40" fill="#7fef9d" />
        {/* figure */}
        <circle cx="930" cy="446" r="10" fill="#ffd166" />
        <rect x="922" y="452" width="16" height="20" fill="#b46bff" />
      </Hotspot>

      {/* DESK + PC (center) */}
      <Hotspot label="机とパソコン" onClick={() => goto("desk")} x={360} y={250} w={320} h={230}>
        {/* desk top */}
        <rect x="350" y="430" width="340" height="60" fill="#241a12" stroke="#3a2a1e" strokeWidth="3" />
        {/* monitor */}
        <rect x="410" y="270" width="220" height="140" rx="6" fill="#0a0715" stroke="#2a2140" strokeWidth="6" />
        <rect x="420" y="280" width="200" height="120" fill="#0f1830" />
        <rect x="420" y="280" width="200" height="120" fill="url(#monitorGlow)" opacity="0.9" />
        <text x="520" y="330" textAnchor="middle" fill="#4be3ff" fontSize="16" fontWeight="700" style={{ animation: "flicker 4s infinite" }}>革命</text>
        <text x="520" y="356" textAnchor="middle" fill="#9a90bd" fontSize="10">-REVOLUTION-</text>
        <rect x="505" y="410" width="30" height="24" fill="#241a12" />
        {/* keyboard */}
        <rect x="440" y="446" width="160" height="26" rx="4" fill="#151024" stroke="#2a2140" strokeWidth="2" />
      </Hotspot>

      {/* BED (left) */}
      <Hotspot label="ベッド" onClick={() => goto("bed")} x={30} y={360} w={300} h={200}>
        <rect x="30" y="420" width="300" height="120" rx="8" fill="#2a1d33" stroke="#3a2a4e" strokeWidth="3" />
        <rect x="30" y="400" width="300" height="40" rx="8" fill="#3a2846" />
        {/* pillow */}
        <rect x="46" y="392" width="90" height="46" rx="10" fill="#c9bfe6" />
        {/* blanket lump */}
        <path d="M150 440 q60 -30 170 0 v70 h-170 Z" fill="#4a2f5e" />
      </Hotspot>

      {/* TRASH pile (floor center-left) */}
      <Hotspot label="ゴミの山" onClick={() => goto("trash")} x={300} y={500} w={130} h={110}>
        {!f.trashSearched ? (
          <>
            <ellipse cx="365" cy="590" rx="70" ry="24" fill="#0a0813" />
            <rect x="320" y="556" width="16" height="34" rx="3" fill="#7fef9d" transform="rotate(-18 328 573)" />
            <rect x="352" y="552" width="16" height="38" rx="3" fill="#ff5d7a" transform="rotate(12 360 571)" />
            <rect x="384" y="560" width="16" height="30" rx="3" fill="#4be3ff" transform="rotate(-6 392 575)" />
            <circle cx="345" cy="586" r="12" fill="#e7e2f5" opacity="0.7" />
          </>
        ) : (
          <ellipse cx="365" cy="592" rx="55" ry="16" fill="#0a0813" />
        )}
      </Hotspot>

      {/* DOOR (right) */}
      <Hotspot label="ドア" onClick={() => goto("door")} x={620} y={150} w={150} h={320} hint>
        <rect x="620" y="150" width="150" height="320" rx="4" fill="#1c1526" stroke="#2f2440" strokeWidth="5" />
        <rect x="636" y="170" width="118" height="130" fill="#231a30" />
        <rect x="636" y="316" width="118" height="130" fill="#231a30" />
        {/* keypad */}
        <rect x="742" y="300" width="26" height="40" rx="3" fill="#0a0715" stroke="#4be3ff" strokeWidth="1.5" />
        <rect x="746" y="305" width="18" height="8" fill="#4be3ff" opacity="0.7" style={{ animation: "pulseGlow 2s infinite" }} />
      </Hotspot>

      {/* vignette */}
      <rect x="0" y="0" width="1000" height="640" fill="black" opacity="0.0" pointerEvents="none" />

      {/* invisible catch-all floor click for flavor */}
      <Hotspot
        label="床"
        onClick={() => say("散らかった床。エナジードリンクの缶とコード類が絡み合っている。")}
        x={430}
        y={560}
        w={520}
        h={70}
      />
    </SceneSvg>
  );
}
