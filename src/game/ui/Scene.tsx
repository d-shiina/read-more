"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useGame } from "../store";
import { ASSETS } from "../assets";
import Hotspot from "./Hotspot";

export default function Scene() {
  const { state, dispatch, say, setFlag, addItem, flag } = useGame();

  // ゲーム開始時、こなちゃんが最初に話しかけてくる
  useEffect(() => {
    if (!flag("talkedKona")) {
      setFlag("talkedKona");
      say([
        { speaker: "こな", portrait: ASSETS.chars.kona, text: "おかえり！ また徹夜？ ……相変わらずだなあ。" },
        { speaker: "こな", portrait: ASSETS.chars.kona, text: "ねえ、久しぶりに“なぞなぞ”出していい？ そこのモニター、クリックして。" },
        { text: "（部屋を調べてみよう。気になる場所をクリック／タップ）" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = state.dialogue.length > 0 || state.puzzle !== null;

  const onHotspot = (id: string) => {
    if (busy) return;
    switch (id) {
      case "monitor":
        if (flag("solvedFrag")) {
          say([{ speaker: "こな", portrait: ASSETS.chars.kona, text: "もう解いちゃったもんね。やるじゃん。" }]);
        } else {
          dispatch({ type: "OPEN_PUZZLE", puzzle: "frag" });
        }
        break;
      case "poster":
        setFlag("posterSeen");
        say([
          { text: "色あせた『革命』のポスター。主人公が世界を塗り替える、あの神ゲー。" },
          { speaker: "こな", portrait: ASSETS.chars.kona, text: "これ一緒にクリアしたよね。夜通しで。" },
        ]);
        break;
      case "window":
        setFlag("windowSeen");
        say([{ text: "窓の外はもう夜。月と、遠くの街の灯り。時間の感覚がとっくに無い。" }]);
        break;
      case "drawer":
        if (!flag("gotUsb")) {
          setFlag("gotUsb");
          addItem("usb");
          say([{ text: "引き出しの奥に、USBメモリを見つけた。『革命』と書いてある。手に入れた：USBメモリ。" }]);
        } else {
          say([{ text: "空っぽの引き出し。" }]);
        }
        break;
      case "bed":
        say([{ text: "しわだらけのベッド。寝てるのか起きてるのか分からない毎日を過ごした場所。" }]);
        break;
      case "door":
        say([
          { text: "部屋のドア。……なんとなく、まだ開ける気になれない。" },
          { speaker: "こな", portrait: ASSETS.chars.kona, text: "先にわたしの謎、解いてよ。ね？" },
        ]);
        break;
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={ASSETS.scenes.room}
        alt="深夜の自室"
        fill
        priority
        sizes="(max-width: 1000px) 100vw, 960px"
        className="object-cover"
      />

      {/* hotspots（％座標は room-night.svg に合わせている） */}
      <Hotspot label="モニター" x={39} y={36} w={22} h={22} hint={!flag("solvedFrag") && !busy} onClick={() => onHotspot("monitor")} />
      <Hotspot label="ポスター" x={76.5} y={8.75} w={15.6} h={32.5} onClick={() => onHotspot("poster")} />
      <Hotspot label="窓" x={4.7} y={10} w={23} h={35} onClick={() => onHotspot("window")} />
      <Hotspot label="引き出し" x={64} y={59} w={9.5} h={11} hint={!flag("gotUsb") && !busy} onClick={() => onHotspot("drawer")} />
      <Hotspot label="ベッド" x={3} y={70} w={22} h={22} onClick={() => onHotspot("bed")} />
      <Hotspot label="ドア" x={82} y={45} w={13} h={45} onClick={() => onHotspot("door")} />
    </div>
  );
}
