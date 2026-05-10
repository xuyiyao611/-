import catAwakened from "@/assets/sumikko/cat-awakened.png";
import cat from "@/assets/sumikko/cat.png";
import ebiFryTailAwakened from "@/assets/sumikko/ebi-fry-tail-awakened.png";
import ebiFryTail from "@/assets/sumikko/ebi-fry-tail.png";
import ghostAwakened from "@/assets/sumikko/ghost-awakened.png";
import ghost from "@/assets/sumikko/ghost.png";
import moleAwakened from "@/assets/sumikko/mole-awakened.png";
import mole from "@/assets/sumikko/mole.png";
import penguinQuestionAwakened from "@/assets/sumikko/penguin-question-awakened.png";
import penguinQuestion from "@/assets/sumikko/penguin-question.png";
import penguinAwakened from "@/assets/sumikko/penguin-awakened.png";
import penguin from "@/assets/sumikko/penguin.png";
import shirokumaAwakened from "@/assets/sumikko/shirokuma-awakened.png";
import shirokuma from "@/assets/sumikko/shirokuma.png";
import tokageAwakened from "@/assets/sumikko/tokage-awakened.png";
import tokage from "@/assets/sumikko/tokage.png";
import type { TileKind } from "@/games/match3/match3Types";

export type TileVisual = {
  awakenedImage: string;
  image: string;
  label: string;
};

export const tileVisuals: Record<TileKind, TileVisual> = {
  sun: {
    awakenedImage: shirokumaAwakened,
    image: shirokuma,
    label: "白熊",
  },
  leaf: {
    awakenedImage: moleAwakened,
    image: mole,
    label: "鼹鼠",
  },
  drop: {
    awakenedImage: tokageAwakened,
    image: tokage,
    label: "水龙",
  },
  berry: {
    awakenedImage: penguinAwakened,
    image: penguin,
    label: "企鹅",
  },
  star: {
    awakenedImage: ghostAwakened,
    image: ghost,
    label: "幽灵",
  },
  candy: {
    awakenedImage: catAwakened,
    image: cat,
    label: "猫咪",
  },
  sprout: {
    awakenedImage: penguinQuestionAwakened,
    image: penguinQuestion,
    label: "企鹅？",
  },
  puff: {
    awakenedImage: ebiFryTailAwakened,
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
