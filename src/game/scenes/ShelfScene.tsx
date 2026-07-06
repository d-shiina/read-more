"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function ShelfScene() {
  const { state, say, setFlag } = useGame();
  const checked = state.flags.shelfChecked;

  return (
    <SceneSvg>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />
      {/* shelf body */}
      <rect x="180" y="60" width="640" height="520" rx="8" fill="#1a1330" stroke="#2a2140" strokeWidth="8" />
      {[180, 235, 400].map((y) => (
        <rect key={y} x="180" y={y} width="640" height="8" fill="#2a2140" />
      ))}

      {/* top shelf: energy cans (the puzzle) */}
      <Hotspot
        label="エナジードリンクの缶"
        onClick={() => {
          setFlag("shelfChecked");
          say("赤いエナジー缶が、そこだけ几帳面に一列に並んでいる。数えると —— きっかり4本。");
        }}
        x={210}
        y={90}
        w={560}
        h={80}
        hint
      >
        {[260, 330, 400, 470].map((x) => (
          <g key={x}>
            <rect x={x} y="96" width="34" height="78" rx="6" fill="#ff5d7a" />
            <rect x={x} y="112" width="34" height="18" fill="#fff" opacity="0.85" />
            <text x={x + 17} y="126" textAnchor="middle" fill="#ff5d7a" fontSize="12" fontWeight="800">EN</text>
          </g>
        ))}
        {checked && (
          <text x="620" y="150" fill="#ffd166" fontSize="40" fontWeight="800">
            ×4
          </text>
        )}
      </Hotspot>

      {/* middle shelf: manga */}
      <Hotspot
        label="漫画の背表紙"
        onClick={() =>
          say("同じ作品を全巻。何度も読み返したのか、背表紙が白く擦れている。今はもう内容を思い出せない。")
        }
        x={210}
        y={250}
        w={560}
        h={140}
      >
        {["#4be3ff", "#b46bff", "#ffd166", "#7fef9d", "#ff5d7a", "#4be3ff", "#b46bff", "#ffd166"].map((c, i) => (
          <rect key={i} x={230 + i * 60} y="260" width="46" height="120" fill={c} opacity="0.85" />
        ))}
      </Hotspot>

      {/* bottom shelf: figure */}
      <Hotspot
        label="フィギュア"
        onClick={() =>
          say("『革命』の主人公フィギュア。埃をかぶっている。……いつからここに座りっぱなしだろう。")
        }
        x={340}
        y={420}
        w={140}
        h={150}
      >
        <circle cx="410" cy="470" r="30" fill="#ffd166" />
        <rect x="386" y="492" width="48" height="70" rx="8" fill="#b46bff" />
        <rect x="360" y="560" width="100" height="14" rx="4" fill="#2a2140" />
      </Hotspot>

      <text x="500" y="612" textAnchor="middle" fill="#9a90bd" fontSize="18">
        戦利品とゴミの境界が、もう分からない棚。
      </text>
    </SceneSvg>
  );
}
