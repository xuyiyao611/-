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
    goal: "后续用于验证更高目标、更复杂棋盘与更紧张参数。",
    notes: ["棋盘更大", "元素更多", "后续接入障碍物"],
  },
  {
    gameType: "sheep",
    difficulty: "easy",
    title: "羊了个羊 - 简单模式",
    shortLabel: "卡牌 / 简单",
    goal: "先验证层级、遮挡、入槽与三消机制。",
    notes: ["层级较浅", "干扰牌较少", "容错更高"],
  },
  {
    gameType: "sheep",
    difficulty: "hard",
    title: "羊了个羊 - 困难模式",
    shortLabel: "卡牌 / 困难",
    goal: "后续用于验证更深层布局和更高槽位压力。",
    notes: ["层级更深", "干扰牌更多", "容错更低"],
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
