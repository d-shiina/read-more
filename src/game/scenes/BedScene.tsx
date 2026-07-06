"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function BedScene() {
  const { state, say, setFlag, addItem, has } = useGame();
  const f = state.flags;

  return (
    <SceneSvg>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />
      <rect x="0" y="430" width="1000" height="210" fill="#0a0813" />

      {/* bed frame */}
      <rect x="120" y="300" width="760" height="230" rx="14" fill="#2a1d33" stroke="#3a2a4e" strokeWidth="6" />
      {/* mattress / sheet */}
      <rect x="140" y="280" width="720" height="90" rx="12" fill="#3a2846" />
      {/* rumpled blanket */}
      <path d="M430 300 q120 -50 420 6 v210 h-420 Z" fill="#4a2f5e" />
      <path d="M470 340 q80 -20 160 4" stroke="#372247" strokeWidth="8" fill="none" />

      {/* pillow -> note */}
      <Hotspot
        label={f.pillowMoved ? "枕の下" : "枕"}
        onClick={() => {
          if (!f.pillowMoved) {
            setFlag("pillowMoved");
            addItem("pillowNote");
            say("枕をどかすと、しわくちゃのメモが挟まっていた。手に入れた：しわくちゃのメモ。");
          } else {
            say("枕の下にはもう何もない。");
          }
        }}
        x={150}
        y={250}
        w={230}
        h={130}
        hint={!f.pillowMoved}
      >
        <rect x="160" y="262" width="200" height="100" rx="22" fill="#c9bfe6" />
        <rect x="160" y="262" width="200" height="100" rx="22" fill="#fff" opacity="0.15" />
        {f.pillowMoved && !has("pillowNote") ? null : null}
      </Hotspot>

      {/* under the bed -> flyer */}
      <Hotspot
        label="ベッドの下"
        onClick={() => {
          if (!has("flyer")) {
            addItem("flyer");
            say("ベッドの下に手を伸ばすと、封も切っていない一通の手紙。手に入れた：運営からの手紙。");
          } else {
            say("ベッドの下は、埃と失くしたイヤホン片方だけ。");
          }
        }}
        x={200}
        y={500}
        w={560}
        h={70}
        hint={!has("flyer")}
      >
        <rect x="200" y="516" width="560" height="20" rx="6" fill="#050409" />
        {!has("flyer") && <rect x="360" y="510" width="70" height="34" rx="3" fill="#e7e2f5" opacity="0.85" transform="rotate(-6 395 527)" />}
      </Hotspot>

      <text x="500" y="612" textAnchor="middle" fill="#9a90bd" fontSize="18">
        寝ているのか起きているのか分からない時間を過ごしたベッド。
      </text>
    </SceneSvg>
  );
}
