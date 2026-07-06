# read more

ネトゲに溺れた夜と、こなちゃんと、フラグムービーへの憧れ——身内向けの、画像つきブラウザ謎解きゲーム。

参考：[gakuyume.kirizou.site/nazo_main](https://gakuyume.kirizou.site/nazo_main) のような
**左サイドバーで場所移動＋アイテム、右にシーン**の構成。

## いま遊べるもの（縦スライス：1場所）

- タイトル →「はじめる」
- **左サイドバー**：MAP（深夜の自室／🔒未開放）・ITEMS（持ち物）・進行度
- **右のシーン**：背景画像の上のホットスポットをクリックして調べる
- **会話**：こなちゃんがADV風ウィンドウ（立ち絵＋タイプライター）で話す
- **アイテム**：引き出しからUSBを入手 → 持ち物に追加、クリックで拡大説明
- **画像パズル**：モニターから「こなちゃんの謎」を開き、答えを入力 → 正解でクリア
- 進行は `localStorage` に保存、view-source に隠しヒント（ブラウザである意味の名残）

## 技術構成

- **Next.js 16**（App Router）+ **React 19** + **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui**（Button / Input / Dialog / Card）＝ ダイアログ・入力・ボタン
- 状態管理：`useReducer` + Context（`src/game/store.tsx`）
- 画像は差し替え可能な構造（いまは仮の SVG プレースホルダ）

## ディレクトリ

```
src/game/
  Game.tsx        画面遷移（タイトル/本編/クリア）＋レイアウト
  store.tsx       ゲーム状態（インベントリ・フラグ・会話・パズル）
  types.ts / items.ts / assets.ts / config.ts
  ui/
    Sidebar.tsx   左：場所移動＋アイテム
    Scene.tsx     右：背景画像＋ホットスポット
    DialogueBox.tsx  ADV風会話ウィンドウ
    PuzzleModal.tsx  画像パズル（shadcn Dialog）
    Inventory.tsx / Title.tsx / Clear.tsx / Hotspot.tsx
public/images/     背景・キャラ・アイテム・パズルの画像
```

## 画像・謎の差し替え

- 画像：`ASSETS.md` の手順で、`public/images/...` を本物の絵に置き換え（`src/game/assets.ts` のパス変更）
- 謎の答え：`src/game/config.ts` の `ANSWERS`（いまは仮で `aftereffects`）
- 会話文：各シーン（`Scene.tsx`）とパズル（`PuzzleModal.tsx`）内

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## この先

- 場所の追加（黒歴史ブログ連携／思い出の日付の謎／こなちゃんのコメント進行）
- 「革命＝AfterEffects」のキメと、こなちゃん・当時の夢へのエンディング
