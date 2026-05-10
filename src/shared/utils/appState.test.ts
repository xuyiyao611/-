import type { AppState } from "@/shared/types/app";
import { appReducer, createInitialAppState } from "@/shared/utils/appState";

function createMatch3GameState(): AppState {
  let state = createInitialAppState();
  state = appReducer(state, { type: "OPEN_DIFFICULTY_SELECT" });
  state = appReducer(state, { type: "SELECT_DIFFICULTY", payload: "easy" });
  return state;
}

describe("appReducer match3 flow", () => {
  it("opens difficulty selection directly from home", () => {
    const state = appReducer(createInitialAppState(), { type: "OPEN_DIFFICULTY_SELECT" });

    expect(state.scene).toBe("difficultySelect");
    expect(state.gameType).toBe("match3");
  });

  it("does not grant rewards when the run is lost", () => {
    const state = createMatch3GameState();

    const resultState = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "lose",
        title: "开心消消乐失败",
        description: "测试失败结算",
        settlement: {
          baseScore: 1200,
          moveBonusScore: 0,
          specialBonusScore: 0,
          finalScore: 1200,
          coinReward: 12,
          rewardGranted: false,
          remainingMoves: 0,
          remainingSpecialTiles: 0,
          explodedTileCount: 0,
          activatedSpecialCount: 0,
          clearedElements: {
            sun: 10,
            leaf: 4,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          fragmentGains: {
            sun: 10,
            leaf: 4,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          selectedTileKinds: ["sun", "leaf", "drop", "berry", "star", "candy"],
        },
      },
    });

    expect(resultState.scene).toBe("result");
    expect(resultState.coins).toBe(10);
    expect(resultState.fragments.sun).toBe(0);
    expect(resultState.fragments.leaf).toBe(0);
  });

  it("stores all earned fragments and converts every extra 20 over 200 into coins", () => {
    const state = createMatch3GameState();

    const resultState = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "win",
        title: "开心消消乐胜利",
        description: "测试兑换",
        settlement: {
          baseScore: 2000,
          moveBonusScore: 0,
          specialBonusScore: 0,
          finalScore: 2000,
          coinReward: 20,
          rewardGranted: true,
          remainingMoves: 0,
          remainingSpecialTiles: 0,
          explodedTileCount: 0,
          activatedSpecialCount: 0,
          clearedElements: {
            sun: 245,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          fragmentGains: {
            sun: 245,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          selectedTileKinds: ["sun", "leaf", "drop", "berry", "star", "candy"],
        },
      },
    });

    expect(resultState.coins).toBe(32);
    expect(resultState.fragments.sun).toBe(245);
    expect(resultState.collectedCharacters.sun).toBe(1);
  });

  it("buys favorite food and grants +3 affection for preferred feeding", () => {
    let state = createMatch3GameState();

    state = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "win",
        title: "开心消消乐胜利",
        description: "测试投喂前置",
        settlement: {
          baseScore: 3000,
          moveBonusScore: 0,
          specialBonusScore: 0,
          finalScore: 3000,
          coinReward: 30,
          rewardGranted: true,
          remainingMoves: 0,
          remainingSpecialTiles: 0,
          explodedTileCount: 0,
          activatedSpecialCount: 0,
          clearedElements: {
            sun: 200,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          fragmentGains: {
            sun: 200,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          selectedTileKinds: ["sun", "leaf", "drop", "berry", "star", "candy"],
        },
      },
    });

    state = appReducer(state, { type: "BUY_FOOD", payload: "popsicle" });

    expect(state.coins).toBe(0);
    expect(state.foods.popsicle).toBe(1);

    state = appReducer(state, {
      type: "FEED_CHARACTER",
      payload: { kind: "sun", foodType: "popsicle" },
    });

    expect(state.foods.popsicle).toBe(0);
    expect(state.affection.sun).toBe(3);
  });

  it("unlocks breakthrough after affection reaches 20", () => {
    let state = createMatch3GameState();

    state = appReducer(state, {
      type: "FINISH_GAME",
      payload: {
        status: "win",
        title: "开心消消乐胜利",
        description: "测试突破前置",
        settlement: {
          baseScore: 3000,
          moveBonusScore: 0,
          specialBonusScore: 0,
          finalScore: 3000,
          coinReward: 30,
          rewardGranted: true,
          remainingMoves: 0,
          remainingSpecialTiles: 0,
          explodedTileCount: 0,
          activatedSpecialCount: 0,
          clearedElements: {
            sun: 200,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          fragmentGains: {
            sun: 200,
            leaf: 0,
            drop: 0,
            berry: 0,
            star: 0,
            candy: 0,
            sprout: 0,
            puff: 0,
          },
          selectedTileKinds: ["sun", "leaf", "drop", "berry", "star", "candy"],
        },
      },
    });

    state = {
      ...state,
      coins: 400,
    };

    for (let i = 0; i < 7; i += 1) {
      state = appReducer(state, { type: "BUY_FOOD", payload: "popsicle" });
      state = appReducer(state, {
        type: "FEED_CHARACTER",
        payload: { kind: "sun", foodType: "popsicle" },
      });
    }

    expect(state.affection.sun).toBe(21);

    state = appReducer(state, { type: "BREAKTHROUGH_CHARACTER", payload: "sun" });

    expect(state.breakthroughs.sun).toBe(true);
  });

  it("spends coins and can reset to a new game", () => {
    let state = createMatch3GameState();
    state = appReducer(state, { type: "SPEND_COINS", payload: 2 });

    expect(state.coins).toBe(8);

    state = appReducer(state, { type: "RESET_NEW_GAME" });

    expect(state.scene).toBe("landing");
    expect(state.coins).toBe(10);
    expect(state.session).toBeNull();
    expect(state.fragments.sun).toBe(0);
    expect(state.collectedCharacters.sun).toBe(0);
    expect(state.foods.pudding).toBe(0);
    expect(state.affection.sun).toBe(0);
    expect(state.breakthroughs.sun).toBe(false);
  });
});
