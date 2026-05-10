import type { Difficulty, GameType } from "@/shared/types/app";

export type ModeOption = {
  gameType: GameType;
  difficulty: Difficulty;
  title: string;
  shortLabel: string;
  goal: string;
  notes: string[];
};

export const modeOptions: ModeOption[] = [
  {
    gameType: "match3",
    difficulty: "easy",
    title: "开心消消乐 - 简单模式",
    shortLabel: "三消 / 简单",
    goal: "先验证棋盘生成、交换和三连消除的最小闭环。",
    notes: ["棋盘较小", "元素种类较少", "目标宽松"],
  },
  {
    gameType: "match3",
    difficulty: "hard",
    title: "开心消消乐 - 困难模式",
    shortLabel: "三消 / 困难",
    goal: "用于验证更高目标、更复杂棋盘与更紧张参数。",
    notes: ["棋盘更大", "元素更多", "预留障碍扩展"],
  },
];

export function getModeOption(gameType: GameType, difficulty: Difficulty): ModeOption {
  const modeOption = modeOptions.find(
    (option) => option.gameType === gameType && option.difficulty === difficulty,
  );

  if (!modeOption) {
    throw new Error(`Missing mode option for ${gameType}/${difficulty}`);
  }

  return modeOption;
}
