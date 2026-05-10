import type { Difficulty } from "@/shared/types/app";
import type {
  SheepCardTemplate,
  SheepConfig,
  SheepKind,
  SheepZone,
  SheepZoneRole,
} from "@/games/sheep/sheepTypes";

type PileSeed = {
  pileId: string;
  zoneId: string;
  zoneLabel: string;
  zoneRole: SheepZoneRole;
  x: number;
  y: number;
  layers: number;
  dx?: number;
  dy?: number;
  tilt?: number;
};

const kindOrder: SheepKind[] = ["bun", "bell", "leaf", "gem"];

function createKinds(totalCards: number): SheepKind[] {
  const kinds: SheepKind[] = [];

  for (let index = 0; index < totalCards; index += 1) {
    kinds.push(kindOrder[Math.floor(index / 3) % kindOrder.length]);
  }

  return kinds;
}

function countCards(piles: PileSeed[]): number {
  return piles.reduce((total, pile) => total + pile.layers, 0);
}

function createZones(piles: PileSeed[]): SheepZone[] {
  const zoneMap = new Map<string, SheepZone>();

  for (const pile of piles) {
    if (zoneMap.has(pile.zoneId)) {
      continue;
    }

    zoneMap.set(pile.zoneId, {
      id: pile.zoneId,
      label: pile.zoneLabel,
      role: pile.zoneRole,
    });
  }

  return [...zoneMap.values()];
}

function createCardTemplates(piles: PileSeed[]): SheepCardTemplate[] {
  const kinds = createKinds(countCards(piles));
  let cursor = 0;

  return piles.flatMap((pile) =>
    Array.from({ length: pile.layers }, (_, index) => {
      const stackIndex = index;
      const card: SheepCardTemplate = {
        id: `${pile.pileId}-${index + 1}`,
        pileId: pile.pileId,
        zoneId: pile.zoneId,
        stackIndex,
        kind: kinds[cursor],
        depth: stackIndex,
        x: pile.x + (pile.dx ?? 0) * index,
        y: pile.y + (pile.dy ?? -12) * index,
        tilt: pile.tilt ?? 0,
      };

      cursor += 1;
      return card;
    }),
  );
}

const easyPiles: PileSeed[] = [
  { pileId: "center-a", zoneId: "center", zoneLabel: "中央牌堆", zoneRole: "core", x: 136, y: 230, layers: 4, dy: -14, tilt: -2 },
  { pileId: "center-b", zoneId: "center", zoneLabel: "中央牌堆", zoneRole: "core", x: 184, y: 220, layers: 5, dy: -14, tilt: 2 },
  { pileId: "center-c", zoneId: "center", zoneLabel: "中央牌堆", zoneRole: "core", x: 232, y: 230, layers: 4, dy: -14, tilt: -1 },
  { pileId: "top-a", zoneId: "top", zoneLabel: "上层补牌区", zoneRole: "upper", x: 160, y: 132, layers: 3, dy: -14, tilt: -3 },
  { pileId: "top-b", zoneId: "top", zoneLabel: "上层补牌区", zoneRole: "upper", x: 208, y: 132, layers: 3, dy: -14, tilt: 3 },
  { pileId: "side-l", zoneId: "side", zoneLabel: "侧翼区", zoneRole: "side", x: 48, y: 212, layers: 2, dy: -14, tilt: -6 },
  { pileId: "side-r", zoneId: "side", zoneLabel: "侧翼区", zoneRole: "side", x: 320, y: 212, layers: 2, dy: -14, tilt: 6 },
];

const hardPiles: PileSeed[] = [
  { pileId: "core-a", zoneId: "core", zoneLabel: "核心牌堆", zoneRole: "core", x: 112, y: 248, layers: 5, dy: -14, tilt: -3 },
  { pileId: "core-b", zoneId: "core", zoneLabel: "核心牌堆", zoneRole: "core", x: 160, y: 232, layers: 6, dy: -14, tilt: 1 },
  { pileId: "core-c", zoneId: "core", zoneLabel: "核心牌堆", zoneRole: "core", x: 208, y: 248, layers: 5, dy: -14, tilt: 3 },
  { pileId: "core-d", zoneId: "core", zoneLabel: "核心牌堆", zoneRole: "core", x: 256, y: 232, layers: 6, dy: -14, tilt: -1 },
  { pileId: "upper-a", zoneId: "upper", zoneLabel: "上层干扰区", zoneRole: "upper", x: 136, y: 146, layers: 4, dy: -14, tilt: -4 },
  { pileId: "upper-b", zoneId: "upper", zoneLabel: "上层干扰区", zoneRole: "upper", x: 232, y: 146, layers: 4, dy: -14, tilt: 4 },
  { pileId: "wing-l", zoneId: "wing", zoneLabel: "侧翼补牌区", zoneRole: "wing", x: 36, y: 216, layers: 3, dy: -14, tilt: -7 },
  { pileId: "wing-r", zoneId: "wing", zoneLabel: "侧翼补牌区", zoneRole: "wing", x: 340, y: 216, layers: 3, dy: -14, tilt: 7 },
];

export const sheepConfigs: Record<Difficulty, SheepConfig> = {
  easy: {
    slotLimit: 7,
    boardWidth: 430,
    boardHeight: 380,
    cardWidth: 88,
    cardHeight: 72,
    title: "第一关节奏",
    intro: "以中央牌堆为主，配合上层补牌区和侧翼区，先验证遮挡、入槽和三消的完整闭环。",
    zones: createZones(easyPiles),
    cards: createCardTemplates(easyPiles),
  },
  hard: {
    slotLimit: 7,
    boardWidth: 460,
    boardHeight: 410,
    cardWidth: 88,
    cardHeight: 72,
    title: "第二关压力",
    intro: "核心牌堆更厚，交叉遮挡更多，上层与侧翼区域共同制造更高的槽位压力。",
    zones: createZones(hardPiles),
    cards: createCardTemplates(hardPiles),
  },
};
