import cat from "@/assets/sumikko/cat.png";
import ebiFryTail from "@/assets/sumikko/ebi-fry-tail.png";
import ghost from "@/assets/sumikko/ghost.png";
import mole from "@/assets/sumikko/mole.png";
import penguin from "@/assets/sumikko/penguin.png";
import penguinQuestion from "@/assets/sumikko/penguin-question.png";
import shirokuma from "@/assets/sumikko/shirokuma.png";
import tokage from "@/assets/sumikko/tokage.png";
import type { TileKind } from "@/games/match3/match3Types";

export type TileVisual = {
  image: string;
  label: string;
};

export const tileVisuals: Record<TileKind, TileVisual> = {
  sun: {
    image: shirokuma,
    label: "白熊",
  },
  leaf: {
    image: mole,
    label: "鼹鼠",
  },
  drop: {
    image: tokage,
    label: "蜥蜴",
  },
  berry: {
    image: penguin,
    label: "企鹅",
  },
  star: {
    image: ghost,
    label: "幽灵",
  },
  candy: {
    image: cat,
    label: "猫咪",
  },
  sprout: {
    image: penguinQuestion,
    label: "企鹅？",
  },
  puff: {
    image: ebiFryTail,
    label: "炸虾尾",
  },
};

export const allTileKinds: TileKind[] = [
  "sun",
  "leaf",
  "drop",
  "berry",
  "star",
  "candy",
  "sprout",
  "puff",
];
