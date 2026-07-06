"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function DoorScene() {
  const { dispatch, say } = useGame();

  return (
    <SceneSvg>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />
      <rect x="0" y="500" width="1000" height="140" fill="#0a0813" />

      {/* door */}
      <rect x="330" y="40" width="340" height="540" rx="6" fill="#1c1526" stroke="#2f2440" strokeWidth="8" />
      <rect x="360" y="70" width="280" height="210" fill="#231a30" />
      <rect x="360" y="330" width="280" height="210" fill="#231a30" />
      {/* handle */}
      <circle cx="360" cy="320" r="12" fill="#5a4585" />

      {/* keypad */}
      <Hotspot
        label="デジタルロックのキーパッド"
        onClick={() => dispatch({ type: "OPEN_PUZZLE", puzzle: "keypad" })}
        x={600}
        y={280}
        w={110}
        h={150}
        hint
      >
        <rect x="600" y="280" width="110" height="150" rx="10" fill="#0a0715" stroke="#4be3ff" strokeWidth="2" />
        <rect x="614" y="294" width="82" height="26" rx="4" fill="#04121a" />
        <text x="655" y="313" textAnchor="middle" fill="#4be3ff" fontSize="16" fontFamily="monospace" letterSpacing="4">
          ----
        </text>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={618 + c * 26} y={330 + r * 26} width="20" height="20" rx="3" fill="#151024" stroke="#2a2140" strokeWidth="1" />
          )),
        )}
      </Hotspot>

      <Hotspot
        label="ドアノブ"
        onClick={() => say("ドアノブは回らない。デジタルロックが施錠している。4桁の暗証番号が要る。")}
        x={340}
        y={300}
        w={44}
        h={44}
      />

      <text x="500" y="612" textAnchor="middle" fill="#9a90bd" fontSize="18">
        見慣れたはずのドア。いつの間にか、見慣れないロックが付いている。
      </text>
    </SceneSvg>
  );
}
