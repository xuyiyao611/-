import { appReducer, createInitialAppState } from "@/shared/utils/appState";
import type { AppState } from "@/shared/types/app";

function createSheepGameState(): AppState {
  let state = createInitialAppState();
  state = appReducer(state, { type: "OPEN_MODE_SELECT" });
  state = appReducer(state, { type: "SELECT_GAME_TYPE", payload: "sheep" });
  state = appReducer(state, { type: "SELECT_DIFFICULTY", payload: "easy" });
  return state;
}

describe("appReducer sheep flow", () => {
  it("restarts the sheep easy mode with a fresh session", () => {
    const state = createSheepGameState();

    expect(state.scene).toBe("game");
    expect(state.session?.runId).toBe(1);

    const resultState = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "lose",
        title: "羊了个羊失败",
        description: "测试失败结算",
      },
    });

    expect(resultState.scene).toBe("result");

    const restartedState = appReducer(resultState, { type: "RESTART_GAME" });

    expect(restartedState.scene).toBe("game");
    expect(restartedState.gameType).toBe("sheep");
    expect(restartedState.difficulty).toBe("easy");
    expect(restartedState.result).toBeNull();
    expect(restartedState.session?.runId).toBe(2);
  });

  it("returns from sheep game to difficulty select and clears the current run", () => {
    const state = createSheepGameState();
    const nextState = appReducer(state, { type: "BACK_TO_DIFFICULTY_SELECT" });

    expect(nextState.scene).toBe("difficultySelect");
    expect(nextState.gameType).toBe("sheep");
    expect(nextState.difficulty).toBeNull();
    expect(nextState.result).toBeNull();
    expect(nextState.session).toBeNull();
  });

  it("returns from sheep result to difficulty select and preserves the game type", () => {
    const state = createSheepGameState();
    const resultState = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "win",
        title: "羊了个羊胜利",
        description: "测试胜利结算",
      },
    });

    const nextState = appReducer(resultState, { type: "BACK_TO_DIFFICULTY_SELECT" });

    expect(nextState.scene).toBe("difficultySelect");
    expect(nextState.gameType).toBe("sheep");
    expect(nextState.difficulty).toBeNull();
    expect(nextState.result).toBeNull();
    expect(nextState.session).toBeNull();
  });
});
