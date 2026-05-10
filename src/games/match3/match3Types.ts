export type TileKind =
  | "sun"
  | "leaf"
  | "drop"
  | "berry"
  | "star"
  | "candy"
  | "sprout"
  | "puff";

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

export type Match3Hint = {
  from: Match3Position;
  to: Match3Position;
};

export type Match3MoveResult = {
  board: Match3Tile[][];
  clearedCount: number;
  clearedIds: string[];
  clearedKinds: TileKind[];
  matched: boolean;
  generatedSpecialCount: number;
  activatedSpecialCount: number;
};

export type Match3Config = {
  rows: number;
  cols: number;
  moveLimit: number;
  targetScore: number;
  shuffleLimit: number;
  tileKinds: TileKind[];
};
