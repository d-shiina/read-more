"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function TrashScene() {
  const { state, say, setFlag, addItem, has } = useGame();
  const searched = state.flags.trashSearched;

  const cans = [
    { x: 300, c: "#7fef9d", r: -18 },
    { x: 360, c: "#ff5d7a", r: 14 },
    { x: 420, c: "#4be3ff", r: -8 },
    { x: 480, c: "#ffd166", r: 20 },
    { x: 540, c: "#b46bff", r: -12 },
    { x: 600, c: "#7fef9d", r: 8 },
  ];

  return (
    <SceneSvg>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />
      <rect x="0" y="440" width="1000" height="200" fill="#0a0813" />

      <Hotspot
        label="ゴミの山を漁る"
        onClick={() => {
          if (!searched) {
            setFlag("trashSearched");
            addItem("smallKey");
            say("空き缶をかき分けると、底に小さな鍵が沈んでいた。手に入れた：小さな鍵。");
          } else if (!has("smallKey")) {
            say("もう漁るものはない。");
          } else {
            say("空き缶とカップ麺の容器。……よくもまあ、ここまで溜めたものだ。");
          }
        }}
        x={240}
        y={360}
        w={520}
        h={230}
        hint={!searched}
      >
        <ellipse cx="500" cy="560" rx="270" ry="70" fill="#0a0813" />
        {cans.map((can, i) => (
          <rect
            key={i}
            x={can.x}
            y={470 + (i % 2) * 24}
            width="36"
            height="84"
            rx="7"
            fill={can.c}
            opacity="0.9"
            transform={`rotate(${can.r} ${can.x + 18} ${512 + (i % 2) * 24})`}
          />
        ))}
        {/* noodle cups */}
        <rect x="330" y="520" width="60" height="50" rx="6" fill="#e7d9b0" />
        <rect x="560" y="516" width="60" height="54" rx="6" fill="#e7d9b0" />
        {searched && has("smallKey") ? null : null}
      </Hotspot>

      <text x="500" y="612" textAnchor="middle" fill="#9a90bd" fontSize="18">
        {searched ? "掘り尽くしたゴミの山。" : "床を埋め尽くす、エナジー缶とカップ麺の残骸。"}
      </text>
    </SceneSvg>
  );
}
