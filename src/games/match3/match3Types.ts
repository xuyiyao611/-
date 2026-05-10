export type TileKind = "sun" | "leaf" | "drop" | "berry" | "star";

export type Match3SpecialType = "rowClear" | "colClear" | "bomb";

export type Match3Tile = {
  id: string;
  kind: TileKind;
  special?: Match3SpecialType;
};

export type Match3Position = {
  row: number;
  col: number;
};

export type Match3MoveResult = {
  board: Match3Tile[][];
  clearedCount: number;
  clearedIds: string[];
  matched: boolean;
  generatedSpecialCount: number;
  activatedSpecialCount: number;
};

export type Match3Config = {
  rows: number;
  cols: number;
  moveLimit: number;
  targetScore: number;
  tileKinds: TileKind[];
};
