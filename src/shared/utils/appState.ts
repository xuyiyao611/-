import type { AppAction, AppState } from "@/shared/types/app";

export function createInitialAppState(): AppState {
  return {
    scene: "home",
    gameType: null,
    difficulty: null,
    result: null,
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "GO_HOME":
      return createInitialAppState();
    case "OPEN_MODE_SELECT":
      return {
        ...state,
        scene: "modeSelect",
      };
    case "SELECT_GAME_TYPE":
      return {
        ...state,
        gameType: action.payload,
        difficulty: null,
        result: null,
        scene: "difficultySelect",
      };
    case "SELECT_DIFFICULTY":
      if (!state.gameType) {
        return {
          ...state,
          scene: "modeSelect",
        };
      }
      return {
        ...state,
        difficulty: action.payload,
        result: null,
        scene: "game",
      };
    case "FINISH_GAME":
      if (!state.gameType || !state.difficulty) {
        return {
          ...state,
          scene: "home",
        };
      }
      return {
        ...state,
        result: action.payload,
        scene: "result",
      };
    case "RESTART_GAME":
      if (!state.gameType || !state.difficulty) {
        return createInitialAppState();
      }
      return {
        ...state,
        result: null,
        scene: "game",
      };
    case "BACK_TO_MODE_SELECT":
      return {
        ...state,
        difficulty: null,
        result: null,
        scene: "modeSelect",
      };
    default:
      return state;
  }
}
