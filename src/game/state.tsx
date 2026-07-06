"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { Action, FlagId, GameState, ItemId, SceneId } from "./types";

const initialFlags: Record<FlagId, boolean> = {
  curtainOpen: false,
  pillowMoved: false,
  trashSearched: false,
  drawerOpen: false,
  usbInserted: false,
  posterPeeled: false,
  shelfChecked: false,
  escaped: false,
};

export const initialState: GameState = {
  screen: "title",
  scene: "room",
  inventory: [],
  selectedItem: null,
  flags: { ...initialFlags },
  message: "",
  puzzle: null,
  startedAt: null,
  finishedAt: null,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START":
      return { ...state, screen: "prologue" };
    case "BEGIN_GAME":
      return {
        ...state,
        screen: "game",
        scene: "room",
        startedAt: Date.now(),
        message: "ふと我に返る。ここは……いつもの自分の部屋。",
      };
    case "GOTO":
      return { ...state, scene: action.scene, selectedItem: null };
    case "MESSAGE":
      return { ...state, message: action.text };
    case "SET_FLAG":
      return {
        ...state,
        flags: { ...state.flags, [action.flag]: action.value ?? true },
      };
    case "ADD_ITEM":
      if (state.inventory.includes(action.item)) return state;
      return { ...state, inventory: [...state.inventory, action.item] };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem:
          state.selectedItem === action.item ? null : action.item,
      };
    case "OPEN_PUZZLE":
      return { ...state, puzzle: action.puzzle };
    case "CLOSE_PUZZLE":
      return { ...state, puzzle: null };
    case "ESCAPE":
      return {
        ...state,
        screen: "ending",
        flags: { ...state.flags, escaped: true },
        finishedAt: Date.now(),
        puzzle: null,
      };
    case "RESET":
      return { ...initialState, flags: { ...initialFlags } };
    default:
      return state;
  }
}

interface GameApi {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  goto: (scene: SceneId) => void;
  say: (text: string) => void;
  setFlag: (flag: FlagId, value?: boolean) => void;
  addItem: (item: ItemId) => void;
  selectItem: (item: ItemId | null) => void;
  has: (item: ItemId) => boolean;
}

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const goto = useCallback((scene: SceneId) => dispatch({ type: "GOTO", scene }), []);
  const say = useCallback((text: string) => dispatch({ type: "MESSAGE", text }), []);
  const setFlag = useCallback(
    (flag: FlagId, value?: boolean) => dispatch({ type: "SET_FLAG", flag, value }),
    [],
  );
  const addItem = useCallback((item: ItemId) => dispatch({ type: "ADD_ITEM", item }), []);
  const selectItem = useCallback(
    (item: ItemId | null) => dispatch({ type: "SELECT_ITEM", item }),
    [],
  );
  const has = useCallback((item: ItemId) => state.inventory.includes(item), [state.inventory]);

  return (
    <Ctx.Provider
      value={{ state, dispatch, goto, say, setFlag, addItem, selectItem, has }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useGame(): GameApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
