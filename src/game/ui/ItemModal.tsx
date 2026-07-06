"use client";

import { useGame } from "../state";
import { ITEMS } from "../items";

/** Shows the details of the currently selected inventory item. */
export default function ItemModal() {
  const { state, selectItem } = useGame();
  const id = state.selectedItem;
  if (!id) return null;
  const item = ITEMS[id];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4"
      onClick={() => selectItem(null)}
    >
      <div
        className="anim-fade w-full max-w-sm rounded-2xl border border-line bg-panel p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-6xl">{item.glyph}</div>
        <h3 className="mb-2 text-lg font-bold text-neon">{item.name}</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {item.desc}
        </p>
        <button
          onClick={() => selectItem(null)}
          className="mt-5 w-full rounded-lg border border-line py-2 text-sm text-muted transition hover:text-text"
        >
          しまう
        </button>
      </div>
    </div>
  );
}
