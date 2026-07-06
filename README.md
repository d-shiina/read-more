# 革命からの脱出 — kakumei escape

オンラインゲーム「革命 -REVOLUTION-」に溺れた廃人の部屋から脱出する、クリック（タップ）型の脱出ゲーム。Next.js 製。

参考にした雰囲気: [gakuyume.kirizou.site](https://gakuyume.kirizou.site/) のような、1画面ずつ調べて謎を解くブラウザ脱出ゲーム。

## 遊び方

1. タイトルで「ゲームを始める」
2. 部屋の各所（窓・机・ベッド・本棚・ポスター・ゴミの山・ドア）をクリックして調べる
3. アイテムを集め、鍵やUSBを使って新たな手がかりを開放する
4. 4つの数字の手がかりを集め、枕の下のメモが示す **順番** でドアのキーパッドに入力
5. 脱出成功！

> ネタバレ注意：暗証番号のロジックは `src/game/items.ts` の `DOOR_CODE`、手がかりは各シーンに実装されています。

## 技術構成

- **Next.js 16**（App Router）+ **React 19** + **TypeScript**
- **Tailwind CSS v4**
- 状態管理は `useReducer` + Context（`src/game/state.tsx`）
- シーン・キャラは外部画像を使わず **インライン SVG** で描画（`src/game/scenes/*`）——アセット依存ゼロで軽量

### ディレクトリ

```
src/
  app/            … Next.js のレイアウト / ページ / グローバルCSS
  game/
    Game.tsx      … 画面遷移のルート（タイトル/プロローグ/本編/エンディング）
    state.tsx     … ゲーム状態（インベントリ・フラグ・シーン）
    types.ts      … 型定義
    items.ts      … アイテム定義と暗証番号
    scenes/       … 各シーンの SVG とホットスポット
    ui/           … インベントリ・キーパッド・タイトル等のUI
```

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
npm start        # 本番サーバー
```

> Node.js 20 以上で動作。開発時の起動速度を優先するなら Node 24 も可（本リポジトリのCIコンテナには未導入のため 22 で検証済み）。

## 新しい謎の足し方

1. `types.ts` に `SceneId` / `FlagId` / `ItemId` を追加
2. `scenes/` に SVG シーンを追加し、`<Hotspot>` でクリック領域を配置
3. `Game.tsx` の `SCENES` / `SCENE_TITLE` に登録
4. 必要なら `items.ts` にアイテムを追加

ホットスポットはキーボード操作（Tab→Enter）にも対応しています。
