"use client";

import { useGame } from "../state";
import SceneSvg from "../ui/SceneSvg";
import Hotspot from "../ui/Hotspot";

export default function DeskScene() {
  const { state, say, setFlag, addItem, has } = useGame();
  const f = state.flags;

  return (
    <SceneSvg>
      <defs>
        <radialGradient id="screenGlow2" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#4be3ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0f1830" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="640" fill="#0c0817" />

      {/* desk top */}
      <rect x="80" y="470" width="840" height="60" fill="#241a12" stroke="#3a2a1e" strokeWidth="4" />
      <rect x="80" y="530" width="840" height="90" fill="#1c140d" />

      {/* MONITOR */}
      <Hotspot
        label="パソコンの画面"
        onClick={() =>
          say(
            f.usbInserted
              ? "画面が砂嵐に乱れ、一瞬だけ数字が浮かぶ —— 「1」。"
              : "『革命』はポーズ画面のまま。右下のUSBスロットが青く点滅している。",
          )
        }
        x={330}
        y={120}
        w={340}
        h={250}
      >
        <rect x="330" y="120" width="340" height="230" rx="10" fill="#0a0715" stroke="#2a2140" strokeWidth="10" />
        <rect x="345" y="135" width="310" height="200" fill="#0f1830" />
        <rect x="345" y="135" width="310" height="200" fill="url(#screenGlow2)" />
        {!f.usbInserted ? (
          <>
            <text x="500" y="215" textAnchor="middle" fill="#4be3ff" fontSize="40" fontWeight="800" style={{ animation: "flicker 5s infinite" }}>
              革命
            </text>
            <text x="500" y="250" textAnchor="middle" fill="#9a90bd" fontSize="14" letterSpacing="3">
              - PAUSED -
            </text>
            <text x="500" y="300" textAnchor="middle" fill="#6a5f8d" fontSize="12">
              セーブせずに終了しますか？
            </text>
          </>
        ) : (
          <>
            <rect x="345" y="135" width="310" height="200" fill="#0a0715" />
            {[...Array(30)].map((_, i) => (
              <rect key={i} x={345 + (i * 53) % 310} y={140 + ((i * 37) % 190)} width={20 + (i % 3) * 14} height="4" fill="#4be3ff" opacity={0.15 + (i % 4) * 0.12} />
            ))}
            <text x="500" y="250" textAnchor="middle" fill="#ffffff" fontSize="90" fontWeight="800" style={{ animation: "flicker 2s infinite" }}>
              1
            </text>
          </>
        )}
        {/* stand */}
        <rect x="485" y="350" width="30" height="30" fill="#241a12" />
        <rect x="455" y="378" width="90" height="12" rx="4" fill="#1c140d" />
      </Hotspot>

      {/* USB port on the tower / desk */}
      <Hotspot
        label="USBスロット"
        onClick={() => {
          if (f.usbInserted) {
            say("USBはもう挿さっている。画面には数字「1」。");
          } else if (has("usb")) {
            setFlag("usbInserted");
            say("USBメモリを挿し込むと、画面が激しく明滅し、砂嵐の中に数字「1」が浮かんだ。");
          } else {
            say("小さなUSBスロットが青く点滅している。何かを挿せそうだ。");
          }
        }}
        x={690}
        y={430}
        w={80}
        h={50}
        hint={has("usb") && !f.usbInserted}
      >
        <rect x="700" y="440" width="60" height="34" rx="5" fill="#151024" stroke="#2a2140" strokeWidth="2" />
        <rect x="712" y="452" width="18" height="10" fill="#4be3ff" opacity="0.8" style={{ animation: "pulseGlow 1.8s infinite" }} />
        {f.usbInserted && <rect x="742" y="450" width="22" height="14" rx="2" fill="#b46bff" />}
      </Hotspot>

      {/* DRAWER (needs small key) */}
      <Hotspot
        label={f.drawerOpen ? "開いた引き出し" : "鍵のかかった引き出し"}
        onClick={() => {
          if (f.drawerOpen) {
            say("空になった引き出し。");
          } else if (has("smallKey")) {
            setFlag("drawerOpen");
            addItem("usb");
            say("小さな鍵で引き出しが開いた。中にはUSBメモリが一つ。手に入れた：USBメモリ。");
          } else {
            say("引き出しには鍵がかかっている。小さな鍵穴がある。");
          }
        }}
        x={740}
        y={530}
        w={170}
        h={80}
        hint={has("smallKey") && !f.drawerOpen}
      >
        <rect x="740" y="530" width="170" height="80" rx="4" fill="#241a12" stroke="#3a2a1e" strokeWidth="3" />
        {f.drawerOpen ? (
          <rect x="740" y="560" width="170" height="60" fill="#0a0715" />
        ) : (
          <circle cx="825" cy="570" r="6" fill="#0a0715" stroke="#5a4530" strokeWidth="2" />
        )}
      </Hotspot>

      {/* keyboard flavor */}
      <Hotspot
        label="キーボード"
        onClick={() => say("キーの隙間にお菓子のかけら。WASDキーだけ、印字が完全に消えている。")}
        x={200}
        y={484}
        w={220}
        h={34}
      >
        <rect x="200" y="484" width="220" height="34" rx="5" fill="#151024" stroke="#2a2140" strokeWidth="2" />
      </Hotspot>

      <text x="500" y="612" textAnchor="middle" fill="#9a90bd" fontSize="18">
        何百時間も向き合ってきた、戦場のような机。
      </text>
    </SceneSvg>
  );
}
