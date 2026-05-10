import type { Difficulty, GameType } from "@/shared/types/app";

export const gameTypeLabels: Record<GameType, string> = {
  match3: "开心消消乐",
  sheep: "羊了个羊",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "简单模式",
  hard: "困难模式",
};

export const gameTypeDescriptions: Record<GameType, string> = {
  match3: "通过交换相邻方块形成三连消除，适合先验证棋盘、掉落和目标规则。",
  sheep: "通过选择未被遮挡的卡牌进入槽位并凑齐三张消除，适合验证层级和槽位机制。",
};

export const difficultyDescriptions: Record<Difficulty, string> = {
  easy: "参数更宽松，适合验证基础玩法是否跑通。",
  hard: "参数更紧张，后续用于验证难度配置和玩法扩展。",
};
