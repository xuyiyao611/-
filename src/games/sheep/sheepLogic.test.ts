import { sheepConfigs } from "@/games/sheep/sheepConfig";
import {
  createCardsForBoard,
  getGameOutcome,
  isCardBlocked,
  moveCardToTray,
  removeTrayTriples,
} from "@/games/sheep/sheepLogic";
import type { SheepCard } from "@/games/sheep/sheepTypes";

function createIsolatedBoard(): SheepCard[] {
  return [
    {
      id: "a",
      pileId: "pile-a",
      zoneId: "left",
      stackIndex: 0,
      kind: "bun",
      depth: 0,
      x: 0,
      y: 0,
      tilt: 0,
      blockers: [],
      status: "board",
    },
    {
      id: "b",
      pileId: "pile-b",
      zoneId: "middle",
      stackIndex: 0,
      kind: "bun",
      depth: 0,
      x: 120,
      y: 0,
      tilt: 0,
      blockers: [],
      status: "board",
    },
    {
      id: "c",
      pileId: "pile-c",
      zoneId: "right",
      stackIndex: 0,
      kind: "bun",
      depth: 0,
      x: 240,
      y: 0,
      tilt: 0,
      blockers: [],
      status: "board",
    },
  ];
}

describe("sheepLogic", () => {
  it("marks covered cards as blocked in the easy board", () => {
    const cards = createCardsForBoard(sheepConfigs.easy);
    const blockedCard = cards.find((card) => isCardBlocked(cards, card.id));
    const openCard = cards.find((card) => !isCardBlocked(cards, card.id));

    expect(blockedCard).toBeDefined();
    expect(openCard).toBeDefined();
    expect(blockedCard?.status).toBe("board");
    expect(openCard?.status).toBe("board");
  });

  it("moves an open card into the tray", () => {
    const cards = createCardsForBoard(sheepConfigs.easy);
    const openCard = cards.find((card) => !isCardBlocked(cards, card.id));

    expect(openCard).toBeDefined();

    const result = moveCardToTray(cards, [], openCard!.id);

    expect(result.blocked).toBe(false);
    expect(result.failureReason).toBeNull();
    expect(result.movedCardId).toBe(openCard!.id);
    expect(result.trayCardIds).toEqual([openCard!.id]);
    expect(result.cards.find((card) => card.id === openCard!.id)?.status).toBe("tray");
  });

  it("does not move a blocked card into the tray", () => {
    const cards = createCardsForBoard(sheepConfigs.easy);
    const blockedCard = cards.find((card) => isCardBlocked(cards, card.id));

    expect(blockedCard).toBeDefined();

    const result = moveCardToTray(cards, [], blockedCard!.id);

    expect(result.blocked).toBe(true);
    expect(result.failureReason).toBe("blocked");
    expect(result.movedCardId).toBeNull();
    expect(result.trayCardIds).toEqual([]);
    expect(result.cards.find((card) => card.id === blockedCard!.id)?.status).toBe("board");
  });

  it("ignores repeated clicks on a card that is already in the tray", () => {
    const cards = createIsolatedBoard();
    const firstMove = moveCardToTray(cards, [], "a");
    const secondMove = moveCardToTray(firstMove.cards, firstMove.trayCardIds, "a");

    expect(firstMove.trayCardIds).toEqual(["a"]);
    expect(secondMove.failureReason).toBe("unavailable");
    expect(secondMove.movedCardId).toBeNull();
    expect(secondMove.trayCardIds).toEqual(["a"]);
  });

  it("ignores missing card ids without changing the board", () => {
    const cards = createIsolatedBoard();
    const result = moveCardToTray(cards, [], "missing-card");

    expect(result.failureReason).toBe("missing");
    expect(result.movedCardId).toBeNull();
    expect(result.trayCardIds).toEqual([]);
    expect(result.cards).toEqual(cards);
  });

  it("clears triples after a tray match", () => {
    const cards = createIsolatedBoard();
    const resolved = removeTrayTriples(
      cards.map((card) => ({
        ...card,
        status: "tray" as const,
      })),
      ["a", "b", "c"],
    );

    expect(resolved.clearedCount).toBe(3);
    expect(resolved.clearedKinds).toEqual(["bun"]);
    expect(resolved.trayCardIds).toEqual([]);
    expect(resolved.cards.every((card) => card.status === "cleared")).toBe(true);
  });

  it("reports win only when all cards are cleared", () => {
    const cards = createIsolatedBoard().map((card) => ({
      ...card,
      status: "cleared" as const,
    }));

    expect(getGameOutcome(cards, [], 7)).toBe("win");
  });

  it("reports lose when the tray reaches its limit without clearing", () => {
    const cards = createIsolatedBoard();

    expect(getGameOutcome(cards, ["a", "b", "c"], 3)).toBe("lose");
  });
});
