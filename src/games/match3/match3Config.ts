import type { Difficulty } from "@/shared/types/app";
import type { Match3Config } from "@/games/match3/match3Types";

export const match3EasyConfig: Match3Config = {
  rows: 6,
  cols: 6,
  moveLimit: 25,
  targetScore: 3000,
  tileKinds: ["sun", "leaf", "drop", "berry"],
};

export const match3HardConfig: Match3Config = {
  rows: 7,
  cols: 7,
  moveLimit: 25,
  targetScore: 4000,
  tileKinds: ["sun", "leaf", "drop", "berry", "star"],
};

export function getMatch3Config(difficulty: Difficulty): Match3Config {
  return difficulty === "hard" ? match3HardConfig : match3EasyConfig;
}
