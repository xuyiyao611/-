import type { AppAction, AppState } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

function createSession(state: AppState): GameSession | null {
  if (!state.gameType || !state.difficulty) {
    return null;
  }

  const previousRunId = state.session?.runId ?? 0;

  return {
    gameType: state.gameType,
    difficulty: state.difficulty,
    startedAt: Date.now(),
    runId: previousRunId + 1,
  };
}

export function createInitialAppState(): AppState {
  return {
    scene: "home",
    gameType: null,
    difficulty: null,
    result: null,
    session: null,
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
        session: null,
        scene: "difficultySelect",
      };
    case "SELECT_DIFFICULTY": {
      if (!state.gameType) {
        return {
          ...state,
          scene: "modeSelect",
        };
      }

      const nextState: AppState = {
        ...state,
        difficulty: action.payload,
        result: null,
        scene: "game",
      };

      return {
        ...nextState,
        session: createSession(nextState),
      };
    }
    case "FINISH_GAME":
      if (!state.gameType || !state.difficulty || !state.session) {
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
        session: createSession(state),
      };
    case "BACK_TO_MODE_SELECT":
      return {
        ...state,
        difficulty: null,
        result: null,
        session: null,
        scene: "modeSelect",
      };
    case "BACK_TO_DIFFICULTY_SELECT":
      if (!state.gameType) {
        return {
          ...state,
          scene: "modeSelect",
        };
      }

      return {
        ...state,
        difficulty: null,
        result: null,
        session: null,
        scene: "difficultySelect",
      };
    default:
      return state;
  }
}
