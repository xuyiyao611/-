import { allTileKinds } from "@/games/match3/match3Assets";
import type { Match3Config } from "@/games/match3/match3Types";
import type { Difficulty } from "@/shared/types/app";

function pickTileKinds(difficulty: Difficulty) {
  return difficulty === "hard" ? allTileKinds.slice(2, 8) : allTileKinds.slice(0, 6);
}

export function getMatch3Config(difficulty: Difficulty): Match3Config {
  return {
    rows: 9,
    cols: 9,
    moveLimit: difficulty === "hard" ? 27 : 32,
    targetScore: difficulty === "hard" ? 4500 : 3200,
    shuffleLimit: 99,
    tileKinds: pickTileKinds(difficulty),
  };
}
