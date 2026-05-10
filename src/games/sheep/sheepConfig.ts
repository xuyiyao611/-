import type { SheepCard, SheepConfig } from "@/games/sheep/sheepTypes";

const easyCards: SheepCard[] = [
  { id: "b1", kind: "bun", layer: 0, x: 0, y: 2, coveredBy: ["m1"], status: "board" },
  { id: "b2", kind: "bell", layer: 0, x: 1, y: 2, coveredBy: ["m1", "m2"], status: "board" },
  { id: "b3", kind: "leaf", layer: 0, x: 2, y: 2, coveredBy: ["m2", "m3"], status: "board" },
  { id: "b4", kind: "gem", layer: 0, x: 3, y: 2, coveredBy: ["m3", "m4"], status: "board" },
  { id: "b5", kind: "bun", layer: 0, x: 4, y: 2, coveredBy: ["m4"], status: "board" },
  { id: "b6", kind: "bell", layer: 0, x: 5, y: 2, coveredBy: [], status: "board" },
  { id: "m1", kind: "leaf", layer: 1, x: 0.5, y: 1, coveredBy: ["t1"], status: "board" },
  { id: "m2", kind: "gem", layer: 1, x: 1.5, y: 1, coveredBy: ["t1", "t2"], status: "board" },
  { id: "m3", kind: "bun", layer: 1, x: 2.5, y: 1, coveredBy: ["t1", "t2"], status: "board" },
  { id: "m4", kind: "bell", layer: 1, x: 3.5, y: 1, coveredBy: ["t2"], status: "board" },
  { id: "t1", kind: "leaf", layer: 2, x: 1.5, y: 0, coveredBy: [], status: "board" },
  { id: "t2", kind: "gem", layer: 2, x: 2.5, y: 0, coveredBy: [], status: "board" },
];

export const sheepEasyConfig: SheepConfig = {
  slotLimit: 7,
  cards: easyCards,
};
