import { applyMove } from "@/games/match3/match3Logic";
import type { Match3Config, Match3Tile, TileKind } from "@/games/match3/match3Types";

const config: Match3Config = {
  rows: 3,
  cols: 3,
  moveLimit: 10,
  targetScore: 100,
  shuffleLimit: 10,
  tileKinds: ["sun", "leaf", "drop", "berry", "star", "candy"],
};

function createTile(id: string, kind: TileKind): Match3Tile {
  return { id, kind };
}

describe("match3 clear rules", () => {
  it("clears three identical tiles in a row", () => {
    const board: Match3Tile[][] = [
      [createTile("a", "drop"), createTile("b", "sun"), createTile("c", "berry")],
      [createTile("d", "sun"), createTile("e", "leaf"), createTile("f", "sun")],
      [createTile("g", "star"), createTile("h", "candy"), createTile("i", "drop")],
    ];

    const result = applyMove(board, { row: 0, col: 1 }, { row: 1, col: 1 }, config);

    expect(result.matched).toBe(true);
    expect(result.clearedCount).toBeGreaterThanOrEqual(3);
    expect(result.clearedKinds.filter((kind) => kind === "sun")).toHaveLength(3);
  });

  it("clears three identical tiles in a column", () => {
    const board: Match3Tile[][] = [
      [createTile("a", "drop"), createTile("b", "leaf"), createTile("c", "berry")],
      [createTile("d", "leaf"), createTile("e", "sun"), createTile("f", "candy")],
      [createTile("g", "star"), createTile("h", "leaf"), createTile("i", "drop")],
    ];

    const result = applyMove(board, { row: 1, col: 0 }, { row: 1, col: 1 }, config);

    expect(result.matched).toBe(true);
    expect(result.clearedCount).toBeGreaterThanOrEqual(3);
    expect(result.clearedKinds.filter((kind) => kind === "leaf")).toHaveLength(3);
  });
});
