import { useMemo, useReducer } from "react";
import { DifficultySelectPage } from "@/pages/difficulty-select/DifficultySelectPage";
import { GamePage } from "@/pages/game/GamePage";
import { HomePage } from "@/pages/home/HomePage";
import { ModeSelectPage } from "@/pages/mode-select/ModeSelectPage";
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
        scene: "modeSelect",
      };
    }

    if (state.scene === "game" && (!state.gameType || !state.difficulty || !state.session)) {
      return {
        ...state,
        scene: state.gameType ? "difficultySelect" : "modeSelect",
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
    return <HomePage onStart={() => dispatch({ type: "OPEN_MODE_SELECT" })} />;
  }

  if (safeState.scene === "modeSelect") {
    return (
      <ModeSelectPage
        selectedGameType={safeState.gameType}
        onBack={() => dispatch({ type: "GO_HOME" })}
        onSelect={(gameType) => dispatch({ type: "SELECT_GAME_TYPE", payload: gameType })}
      />
    );
  }

  if (safeState.scene === "difficultySelect") {
    return (
      <DifficultySelectPage
        gameType={safeState.gameType}
        selectedDifficulty={safeState.difficulty}
        onBack={() => dispatch({ type: "OPEN_MODE_SELECT" })}
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
        onBackHome={() => dispatch({ type: "GO_HOME" })}
        onBackModeSelect={() => dispatch({ type: "BACK_TO_MODE_SELECT" })}
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
        result={safeState.result}
        summary={`${gameTypeLabels[safeState.gameType]} / ${difficultyLabels[safeState.difficulty]}`}
        onRestart={() => dispatch({ type: "RESTART_GAME" })}
        onBackHome={() => dispatch({ type: "GO_HOME" })}
        onBackModeSelect={() => dispatch({ type: "BACK_TO_MODE_SELECT" })}
      />
    );
  }

  return <HomePage onStart={() => dispatch({ type: "OPEN_MODE_SELECT" })} />;
}
