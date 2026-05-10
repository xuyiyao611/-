import type {
  SheepCard,
  SheepCardTemplate,
  SheepConfig,
  SheepGameOutcome,
  SheepKind,
  SheepMoveResult,
  SheepTraySlot,
} from "@/games/sheep/sheepTypes";

const OVERLAP_X = 58;
const OVERLAP_Y = 52;

function overlaps(topCard: SheepCard, baseCard: SheepCard): boolean {
  return Math.abs(topCard.x - baseCard.x) < OVERLAP_X && Math.abs(topCard.y - baseCard.y) < OVERLAP_Y;
}

function cloneCards(cards: SheepCardTemplate[]): SheepCard[] {
  return cards.map((card) => ({
    ...card,
    blockers: [],
    status: "board",
  }));
}

function findCard(cards: SheepCard[], cardId: string): SheepCard | undefined {
  return cards.find((card) => card.id === cardId);
}

function createFailedMoveResult(
  cards: SheepCard[],
  trayCardIds: string[],
  failureReason: SheepMoveResult["failureReason"],
): SheepMoveResult {
  return {
    cards,
    trayCardIds,
    clearedKinds: [],
    clearedCount: 0,
    movedCardId: null,
    blocked: failureReason === "blocked",
    failureReason,
  };
}

function isTopOfPile(cards: SheepCard[], card: SheepCard): boolean {
  return !cards.some(
    (candidate) =>
      candidate.status === "board" &&
      candidate.pileId === card.pileId &&
      candidate.stackIndex > card.stackIndex,
  );
}

export function attachBlockers(cards: SheepCard[]): SheepCard[] {
  return cards.map((card) => {
    const blockers = cards
      .filter((candidate) => candidate.id !== card.id)
      .filter((candidate) => candidate.pileId !== card.pileId)
      .filter((candidate) => overlaps(candidate, card))
      .filter((candidate) => candidate.y < card.y || candidate.stackIndex > card.stackIndex)
      .map((candidate) => candidate.id);

    return {
      ...card,
      blockers,
    };
  });
}

export function createCardsForBoard(config: SheepConfig): SheepCard[] {
  return attachBlockers(cloneCards(config.cards));
}

export function createTraySlots(slotLimit: number, trayCardIds: string[]): SheepTraySlot[] {
  return Array.from({ length: slotLimit }, (_, index) => ({
    index,
    cardId: trayCardIds[index] ?? null,
  }));
}

export function isCardBlocked(cards: SheepCard[], cardId: string): boolean {
  const card = findCard(cards, cardId);
  if (!card || card.status !== "board") {
    return false;
  }

  if (!isTopOfPile(cards, card)) {
    return true;
  }

  return card.blockers.some((blockerId) => cards.some((item) => item.id === blockerId && item.status === "board"));
}

export function allCardsCleared(cards: SheepCard[]): boolean {
  return cards.every((card) => card.status === "cleared");
}

export function removeTrayTriples(
  cards: SheepCard[],
  trayCardIds: string[],
): Omit<SheepMoveResult, "blocked" | "movedCardId" | "failureReason"> {
  const counts = new Map<SheepKind, string[]>();

  for (const cardId of trayCardIds) {
    const card = findCard(cards, cardId);
    if (!card) {
      continue;
    }

    const group = counts.get(card.kind) ?? [];
    group.push(cardId);
    counts.set(card.kind, group);
  }

  const toClearIds = new Set<string>();
  const clearedKinds: SheepKind[] = [];

  for (const [kind, ids] of counts.entries()) {
    if (ids.length >= 3) {
      ids.slice(0, 3).forEach((id) => toClearIds.add(id));
      clearedKinds.push(kind);
    }
  }

  if (toClearIds.size === 0) {
    return {
      cards,
      trayCardIds,
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
    trayCardIds: trayCardIds.filter((id) => !toClearIds.has(id)),
    clearedKinds,
    clearedCount: toClearIds.size,
  };
}

export function moveCardToTray(cards: SheepCard[], trayCardIds: string[], cardId: string): SheepMoveResult {
  const targetCard = findCard(cards, cardId);
  if (!targetCard) {
    return createFailedMoveResult(cards, trayCardIds, "missing");
  }

  if (targetCard.status !== "board") {
    return createFailedMoveResult(cards, trayCardIds, "unavailable");
  }

  if (isCardBlocked(cards, cardId)) {
    return createFailedMoveResult(cards, trayCardIds, "blocked");
  }

  const nextCards = cards.map((card) =>
    card.id === cardId
      ? {
          ...card,
          status: "tray" as const,
        }
      : card,
  );

  const resolved = removeTrayTriples(nextCards, [...trayCardIds, cardId]);

  return {
    ...resolved,
    movedCardId: cardId,
    blocked: false,
    failureReason: null,
  };
}

export function getGameOutcome(cards: SheepCard[], trayCardIds: string[], slotLimit: number): SheepGameOutcome {
  if (allCardsCleared(cards)) {
    return "win";
  }

  if (trayCardIds.length >= slotLimit) {
    return "lose";
  }

  return "ongoing";
}
