import { useState } from "react";
import { HomePage } from "@/pages/home/HomePage";
import { ModeSelectPage } from "@/pages/mode-select/ModeSelectPage";
import { DifficultySelectPage } from "@/pages/difficulty-select/DifficultySelectPage";
import { GamePage } from "@/pages/game/GamePage";
import { ResultPage } from "@/pages/result/ResultPage";
import type { Difficulty, GameType, ResultPayload, SceneKey } from "@/shared/types/app";

export function App() {
  const [scene, setScene] = useState<SceneKey>("home");
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [result, setResult] = useState<ResultPayload | null>(null);

  if (scene === "home") {
    return <HomePage onStart={() => setScene("modeSelect")} />;
  }

  if (scene === "modeSelect") {
    return (
      <ModeSelectPage
        onBack={() => setScene("home")}
        onSelect={(nextGameType) => {
          setGameType(nextGameType);
          setDifficulty(null);
          setScene("difficultySelect");
        }}
      />
    );
  }

  if (scene === "difficultySelect") {
    return (
      <DifficultySelectPage
        gameType={gameType}
        onBack={() => setScene("modeSelect")}
        onSelect={(nextDifficulty) => {
          setDifficulty(nextDifficulty);
          setScene("game");
        }}
      />
    );
  }

  if (scene === "game") {
    return (
      <GamePage
        gameType={gameType}
        difficulty={difficulty}
        onBackHome={() => {
          setGameType(null);
          setDifficulty(null);
          setResult(null);
          setScene("home");
        }}
        onFinish={(nextResult) => {
          setResult(nextResult);
          setScene("result");
        }}
      />
    );
  }

  return (
    <ResultPage
      result={result}
      onRestart={() => setScene("game")}
      onBackHome={() => {
        setGameType(null);
        setDifficulty(null);
        setResult(null);
        setScene("home");
      }}
      onBackModeSelect={() => {
        setDifficulty(null);
        setResult(null);
        setScene("modeSelect");
      }}
    />
  );
}
