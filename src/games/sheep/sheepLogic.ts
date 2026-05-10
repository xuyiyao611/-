import type { SheepCard } from "@/games/sheep/sheepTypes";

export function cloneCards(cards: SheepCard[]): SheepCard[] {
  return cards.map((card) => ({ ...card, coveredBy: [...card.coveredBy] }));
}

export function isCardBlocked(cards: SheepCard[], cardId: string): boolean {
  const card = cards.find((item) => item.id === cardId);
  if (!card || card.status !== "board") {
    return false;
  }

  return card.coveredBy.some((coverId) => cards.some((item) => item.id === coverId && item.status === "board"));
}

export function allCardsCleared(cards: SheepCard[]): boolean {
  return cards.every((card) => card.status === "cleared");
}

export function removeTrayTriples(
  cards: SheepCard[],
  trayIds: string[],
): {
  cards: SheepCard[];
  trayIds: string[];
  clearedKinds: string[];
  clearedCount: number;
} {
  const counts = new Map<string, string[]>();

  for (const cardId of trayIds) {
    const card = cards.find((item) => item.id === cardId);
    if (!card) {
      continue;
    }

    const group = counts.get(card.kind) ?? [];
    group.push(cardId);
    counts.set(card.kind, group);
  }

  const toClearIds = new Set<string>();
  const clearedKinds: string[] = [];

  for (const [kind, ids] of counts.entries()) {
    if (ids.length >= 3) {
      ids.slice(0, 3).forEach((id) => toClearIds.add(id));
      clearedKinds.push(kind);
    }
  }

  if (toClearIds.size === 0) {
    return {
      cards,
      trayIds,
      clearedKinds: [],
      clearedCount: 0,
    };
  }

  const nextCards = cards.map((card) =>
    toClearIds.has(card.id)
      ? {
          ...card,
          status: "cleared" as const,
        }
      : card,
  );

  return {
    cards: nextCards,
    trayIds: trayIds.filter((id) => !toClearIds.has(id)),
    clearedKinds,
    clearedCount: toClearIds.size,
  };
}
