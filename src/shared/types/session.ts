import type { Difficulty, GameType } from "@/shared/types/app";

export type GameSession = {
  gameType: GameType;
  difficulty: Difficulty;
  startedAt: number;
  runId: number;
};
