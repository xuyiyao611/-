import type { TileKind } from "@/games/match3/match3Types";
import type { FoodType } from "@/shared/types/app";

export const FRAGMENTS_PER_CHARACTER = 200;
export const BREAKTHROUGH_AFFECTION = 20;

export const foodTypes: FoodType[] = ["pudding", "soda", "popsicle"];

export const foodLabels: Record<FoodType, string> = {
  pudding: "布丁",
  soda: "汽水",
  popsicle: "冰棍",
};

export const foodPrices: Record<FoodType, number> = {
  pudding: 20,
  soda: 30,
  popsicle: 40,
};

export const characterDescriptions: Record<TileKind, string> = {
  sun: "白熊喜欢安静和柔软的角落，性格温吞，适合做首页图鉴的治愈担当。",
  leaf: "鼹鼠擅长在地底活动，平时安安静静，但对新鲜事物会很好奇。",
  drop: "水龙外表冷静，其实内心柔软，适合用来做偏清爽风格的角色展示。",
  berry: "企鹅总是带着一点迟疑感，表情很有辨识度，适合做收集进度展示。",
  star: "幽灵存在感很轻，但轮廓独特，灰色剪影状态也容易识别。",
  candy: "猫咪看起来懒洋洋的，作为收集角色时很适合搭配好感度养成。",
  sprout: "企鹅？有很强的反差感，适合做后期偏好食物和互动文案的重点角色。",
  puff: "炸虾尾辨识度很强，适合在图鉴里做稀有感更强的展示。",
};

export const characterFavoriteFoods: Record<TileKind, FoodType | null> = {
  sun: "popsicle",
  leaf: "soda",
  drop: "soda",
  berry: "popsicle",
  star: "pudding",
  candy: "pudding",
  sprout: "popsicle",
  puff: "soda",
};

export function getFoodPreferenceLabel(foodType: FoodType | null): string {
  return foodType ? foodLabels[foodType] : "待设置";
}

export function getAffectionGain(kind: TileKind, foodType: FoodType): number {
  return characterFavoriteFoods[kind] === foodType ? 3 : 1;
}
