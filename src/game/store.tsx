"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { FlagId, GameState, ItemId, Line, SceneId } from "./types";

const initialFlags: Record<FlagId, boolean> = {
  talkedKona: false,
  gotUsb: false,
  gotDisc: false,
  posterSeen: false,
  windowSeen: false,
  solvedFrag: false,
};

export const initialState: GameState & { endAfterDialogue: boolean } = {
  screen: "title",
  scene: "room",
  inventory: [],
  flags: { ...initialFlags },
  dialogue: [],
  dialogueIndex: 0,
  puzzle: null,
  selectedItem: null,
  startedAt: null,
  finishedAt: null,
  endAfterDialogue: false,
};

type State = typeof initialState;

type Action =
  | { type: "START" }
  | { type: "RESET" }
  | { type: "GOTO"; scene: SceneId }
  | { type: "SAY"; lines: Line[]; endAfter?: boolean }
  | { type: "ADVANCE" }
  | { type: "SET_FLAG"; flag: FlagId; value?: boolean }
  | { type: "ADD_ITEM"; item: ItemId }
  | { type: "SELECT_ITEM"; item: ItemId | null }
  | { type: "OPEN_PUZZLE"; puzzle: "frag" }
  | { type: "CLOSE_PUZZLE" }
  | { type: "SOLVE_FRAG"; lines: Line[] }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return {
        ...state,
        screen: "game",
        startedAt: Date.now(),
      };
    case "RESET":
      return { ...initialState, flags: { ...initialFlags } };
    case "GOTO":
      return { ...state, scene: action.scene };
    case "SAY":
      return {
        ...state,
        dialogue: action.lines,
        dialogueIndex: 0,
        endAfterDialogue: action.endAfter ?? false,
      };
    case "ADVANCE": {
      if (state.dialogueIndex < state.dialogue.length - 1) {
        return { ...state, dialogueIndex: state.dialogueIndex + 1 };
      }
      // 会話終了
      if (state.endAfterDialogue) {
        return { ...state, dialogue: [], dialogueIndex: 0, screen: "clear", finishedAt: Date.now(), endAfterDialogue: false };
      }
      return { ...state, dialogue: [], dialogueIndex: 0 };
    }
    case "SET_FLAG":
      return { ...state, flags: { ...state.flags, [action.flag]: action.value ?? true } };
    case "ADD_ITEM":
      if (state.inventory.includes(action.item)) return state;
      return { ...state, inventory: [...state.inventory, action.item] };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: state.selectedItem === action.item ? null : action.item,
      };
    case "OPEN_PUZZLE":
      return { ...state, puzzle: action.puzzle };
    case "CLOSE_PUZZLE":
      return { ...state, puzzle: null };
    case "SOLVE_FRAG":
      return {
        ...state,
        puzzle: null,
        flags: { ...state.flags, solvedFrag: true },
        dialogue: action.lines,
        dialogueIndex: 0,
        endAfterDialogue: true,
      };
    case "CLEAR":
      return { ...state, screen: "clear", finishedAt: Date.now() };
    default:
      return state;
  }
}

interface Api {
  state: State;
  dispatch: React.Dispatch<Action>;
  say: (lines: Line[], endAfter?: boolean) => void;
  setFlag: (flag: FlagId, value?: boolean) => void;
  addItem: (item: ItemId) => void;
  has: (item: ItemId) => boolean;
  flag: (f: FlagId) => boolean;
}

const Ctx = createContext<Api | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const say = useCallback(
    (lines: Line[], endAfter?: boolean) => dispatch({ type: "SAY", lines, endAfter }),
    [],
  );
  const setFlag = useCallback(
    (flag: FlagId, value?: boolean) => dispatch({ type: "SET_FLAG", flag, value }),
    [],
  );
  const addItem = useCallback((item: ItemId) => dispatch({ type: "ADD_ITEM", item }), []);
  const has = useCallback((item: ItemId) => state.inventory.includes(item), [state.inventory]);
  const flag = useCallback((f: FlagId) => state.flags[f], [state.flags]);

  return (
    <Ctx.Provider value={{ state, dispatch, say, setFlag, addItem, has, flag }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGame(): Api {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
