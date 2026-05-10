import type { Difficulty, GameType } from "@/shared/types/app";

export const gameTypeLabels: Record<GameType, string> = {
  match3: "角落消消",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单模式",
  hard: "困难模式",
};

export const gameTypeDescriptions: Record<GameType, string> = {
  match3: "交换相邻方块形成三连消，收集角色碎片、金币和喂食资源，慢慢填满你的治愈角落。",
};

export const difficultyDescriptions: Record<Difficulty, string> = {
  easy: "目标分数更低，刷新白熊、鼹鼠、水龙、企鹅、幽灵、猫咪 6 类元素。",
  hard: "目标分数更高，刷新水龙、企鹅、幽灵、猫咪、企鹅？、炸虾尾 6 类元素。",
};
