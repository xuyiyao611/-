import type { Difficulty, GameType } from "@/shared/types/app";

export const gameTypeLabels: Record<GameType, string> = {
  match3: "开心消消乐",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单模式",
  hard: "困难模式",
};

export const gameTypeDescriptions: Record<GameType, string> = {
  match3: "通过交换相邻方块形成三连消，验证棋盘、掉落、提示、洗牌和金币消耗规则。",
};

export const difficultyDescriptions: Record<Difficulty, string> = {
  easy: "目标分数更低，刷新白熊、鼹鼠、蜥蜴、企鹅、幽灵、猫咪 6 类元素。",
  hard: "目标分数更高，刷新蜥蜴、企鹅、幽灵、猫咪、企鹅？、炸虾尾 6 类元素。",
};
