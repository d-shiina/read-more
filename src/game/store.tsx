"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

type Screen = "title" | "game";

interface State {
  screen: Screen;
  solved: string[]; // 解いた記事ID
  hydrated: boolean; // localStorageから復元済み
}

const initial: State = { screen: "title", solved: [], hydrated: false };

const STORAGE_KEY = "readmore.solved";

type Action =
  | { type: "START" }
  | { type: "HYDRATE"; solved: string[] }
  | { type: "SOLVE"; id: string }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, screen: "game" };
    case "HYDRATE":
      return { ...state, solved: action.solved, hydrated: true };
    case "SOLVE":
      if (state.solved.includes(action.id)) return state;
      return { ...state, solved: [...state.solved, action.id] };
    case "RESET":
      return { screen: "game", solved: [], hydrated: true };
    default:
      return state;
  }
}

interface Api {
  state: State;
  dispatch: React.Dispatch<Action>;
  isSolved: (id: string) => boolean;
}

const Ctx = createContext<Api | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // 進行を localStorage から復元（ブラウザに保存＝ブラウザである意味）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "HYDRATE", solved: raw ? JSON.parse(raw) : [] });
    } catch {
      dispatch({ type: "HYDRATE", solved: [] });
    }
  }, []);

  // 変化があれば保存
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.solved));
    } catch {}
  }, [state.solved, state.hydrated]);

  const isSolved = (id: string) => state.solved.includes(id);

  return (
    <Ctx.Provider value={{ state, dispatch, isSolved }}>{children}</Ctx.Provider>
  );
}

export function useGame(): Api {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
