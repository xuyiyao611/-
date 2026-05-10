import { useMemo, useReducer } from "react";
import { DifficultySelectPage } from "@/pages/difficulty-select/DifficultySelectPage";
import { GamePage } from "@/pages/game/GamePage";
import { HomePage } from "@/pages/home/HomePage";
import { ResultPage } from "@/pages/result/ResultPage";
import { difficultyLabels, gameTypeLabels } from "@/shared/config/gameCatalog";
import type { AppState } from "@/shared/types/app";
import { appReducer, createInitialAppState } from "@/shared/utils/appState";

export function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialAppState);

  const safeState = useMemo<AppState>(() => {
    if (state.scene === "difficultySelect" && !state.gameType) {
      return {
        ...state,
        gameType: "match3",
      };
    }

    if (state.scene === "game" && (!state.gameType || !state.difficulty || !state.session)) {
      return {
        ...state,
        gameType: "match3",
        scene: "difficultySelect",
      };
    }

    if (
      state.scene === "result" &&
      (!state.gameType || !state.difficulty || !state.result || !state.session)
    ) {
      return {
        ...state,
        scene: state.gameType ? "difficultySelect" : "home",
      };
    }

    return state;
  }, [state]);

  if (safeState.scene === "home") {
    return (
      <HomePage
        coins={safeState.coins}
        fragments={safeState.fragments}
        collectedCharacters={safeState.collectedCharacters}
        affection={safeState.affection}
        breakthroughs={safeState.breakthroughs}
        foods={safeState.foods}
        onStart={() => dispatch({ type: "OPEN_DIFFICULTY_SELECT" })}
        onNewGame={() => dispatch({ type: "RESET_NEW_GAME" })}
        onBuyFood={(foodType) => dispatch({ type: "BUY_FOOD", payload: foodType })}
        onFeedCharacter={(kind, foodType) =>
          dispatch({ type: "FEED_CHARACTER", payload: { kind, foodType } })
        }
        onBreakthrough={(kind) => dispatch({ type: "BREAKTHROUGH_CHARACTER", payload: kind })}
      />
    );
  }

  if (safeState.scene === "difficultySelect") {
    return (
      <DifficultySelectPage
        gameType={safeState.gameType}
        selectedDifficulty={safeState.difficulty}
        onBack={() => dispatch({ type: "GO_HOME" })}
        onSelect={(difficulty) => dispatch({ type: "SELECT_DIFFICULTY", payload: difficulty })}
      />
    );
  }

  if (
    safeState.scene === "game" &&
    safeState.gameType &&
    safeState.difficulty &&
    safeState.session
  ) {
    return (
      <GamePage
        session={safeState.session}
        gameType={safeState.gameType}
        difficulty={safeState.difficulty}
        coins={safeState.coins}
        onSpendCoins={(amount) => dispatch({ type: "SPEND_COINS", payload: amount })}
        onBackHome={() => dispatch({ type: "GO_HOME" })}
        onBackModeSelect={() => dispatch({ type: "BACK_TO_DIFFICULTY_SELECT" })}
        onFinish={(result) => dispatch({ type: "FINISH_GAME", payload: result })}
      />
    );
  }

  if (
    safeState.scene === "result" &&
    safeState.result &&
    safeState.gameType &&
    safeState.difficulty &&
    safeState.session
  ) {
    return (
      <ResultPage
        coins={safeState.coins}
        fragments={safeState.fragments}
        collectedCharacters={safeState.collectedCharacters}
        result={safeState.result}
        summary={`${gameTypeLabels[safeState.gameType]} / ${difficultyLabels[safeState.difficulty]}`}
        onRestart={() => dispatch({ type: "RESTART_GAME" })}
        onBackHome={() => dispatch({ type: "GO_HOME" })}
        onBackModeSelect={() => dispatch({ type: "BACK_TO_DIFFICULTY_SELECT" })}
      />
    );
  }

  return (
    <HomePage
      coins={safeState.coins}
      fragments={safeState.fragments}
      collectedCharacters={safeState.collectedCharacters}
      affection={safeState.affection}
      breakthroughs={safeState.breakthroughs}
      foods={safeState.foods}
      onStart={() => dispatch({ type: "OPEN_DIFFICULTY_SELECT" })}
      onNewGame={() => dispatch({ type: "RESET_NEW_GAME" })}
      onBuyFood={(foodType) => dispatch({ type: "BUY_FOOD", payload: foodType })}
      onFeedCharacter={(kind, foodType) =>
        dispatch({ type: "FEED_CHARACTER", payload: { kind, foodType } })
      }
      onBreakthrough={(kind) => dispatch({ type: "BREAKTHROUGH_CHARACTER", payload: kind })}
    />
  );
}
