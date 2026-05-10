import type { Match3Config } from "@/games/match3/match3Types";

export const match3EasyConfig: Match3Config = {
  rows: 6,
  cols: 6,
  moveLimit: 18,
  targetScore: 180,
  tileKinds: ["sun", "leaf", "drop", "berry"],
};
