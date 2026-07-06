import type * as PageTree from "fumadocs-core/page-tree";

/**
 * Fumadocs の左サイドバー（章立て）。手動で組んでいる（MDX不使用）。
 * 隠しページ（第2話以降）はネタバレ防止でツリーに載せない。
 */
export const tree: PageTree.Root = {
  name: "read more",
  children: [
    {
      type: "page",
      name: "第1話「これは、革命だ」",
      url: "/",
    },
    {
      type: "separator",
      name: "── ここから先は未公開 ──",
    },
    {
      type: "page",
      name: "🔒 第2話（続きを読む）",
      url: "/",
    },
  ],
};
