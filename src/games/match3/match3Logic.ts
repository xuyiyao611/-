import type {
  Match3Config,
  Match3Hint,
  Match3MoveResult,
  Match3Position,
  Match3SpecialType,
  Match3Tile,
  TileKind,
} from "@/games/match3/match3Types";

let nextTileId = 0;

type MatchGroup = {
  positions: Match3Position[];
  orientation: "horizontal" | "vertical";
};

type SpecialSpawn = {
  position: Match3Position;
  kind: TileKind;
  special: Match3SpecialType;
};

function createTile(kind: TileKind, special?: Match3SpecialType): Match3Tile {
  nextTileId += 1;
  return {
    id: `tile-${nextTileId}`,
    kind,
    special,
  };
}

function cloneBoard(board: Match3Tile[][]): Match3Tile[][] {
  return board.map((row) => row.map((tile) => ({ ...tile })));
}

function cloneTileList(board: Match3Tile[][]): Match3Tile[] {
  return board.flatMap((row) => row.map((tile) => ({ ...tile })));
}

function randomKind(kinds: TileKind[]): TileKind {
  const index = Math.floor(Math.random() * kinds.length);
  return kinds[index];
}

function shuffleTiles(tiles: Match3Tile[]): Match3Tile[] {
  const nextTiles = [...tiles];

  for (let index = nextTiles.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = nextTiles[index];
    nextTiles[index] = nextTiles[swapIndex];
    nextTiles[swapIndex] = temp;
  }

  return nextTiles;
}

function rebuildBoard(rows: number, cols: number, tiles: Match3Tile[]): Match3Tile[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => tiles[row * cols + col]),
  );
}

function samePosition(a: Match3Position, b: Match3Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function makePositionKey(position: Match3Position): string {
  return `${position.row}:${position.col}`;
}

function hasImmediateMatch(board: Match3Tile[][], row: number, col: number): boolean {
  const kind = board[row][col].kind;

  if (col >= 2 && board[row][col - 1].kind === kind && board[row][col - 2].kind === kind) {
    return true;
  }

  if (row >= 2 && board[row - 1][col].kind === kind && board[row - 2][col].kind === kind) {
    return true;
  }

  return false;
}

export function createInitialBoard(config: Match3Config): Match3Tile[][] {
  const board: Match3Tile[][] = [];

  for (let row = 0; row < config.rows; row += 1) {
    const currentRow: Match3Tile[] = [];

    for (let col = 0; col < config.cols; col += 1) {
      let kind = randomKind(config.tileKinds);

      while (
        (col >= 2 &&
          currentRow[col - 1].kind === kind &&
          currentRow[col - 2].kind === kind) ||
        (row >= 2 && board[row - 1][col].kind === kind && board[row - 2][col].kind === kind)
      ) {
        kind = randomKind(config.tileKinds);
      }

      currentRow.push(createTile(kind));
    }

    board.push(currentRow);
  }

  return board;
}

export function areAdjacent(a: Match3Position, b: Match3Position): boolean {
  const rowDistance = Math.abs(a.row - b.row);
  const colDistance = Math.abs(a.col - b.col);

  return rowDistance + colDistance === 1;
}

function swapTiles(board: Match3Tile[][], a: Match3Position, b: Match3Position): Match3Tile[][] {
  const nextBoard = cloneBoard(board);
  const temp = nextBoard[a.row][a.col];
  nextBoard[a.row][a.col] = nextBoard[b.row][b.col];
  nextBoard[b.row][b.col] = temp;
  return nextBoard;
}

function collectMatchGroups(board: Match3Tile[][]): MatchGroup[] {
  const groups: MatchGroup[] = [];
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    let startCol = 0;

    while (startCol < cols) {
      let endCol = startCol + 1;
      while (endCol < cols && board[row][endCol].kind === board[row][startCol].kind) {
        endCol += 1;
      }

      if (endCol - startCol >= 3) {
        groups.push({
          positions: Array.from({ length: endCol - startCol }, (_, index) => ({
            row,
            col: startCol + index,
          })),
          orientation: "horizontal",
        });
      }

      startCol = endCol;
    }
  }

  for (let col = 0; col < cols; col += 1) {
    let startRow = 0;

    while (startRow < rows) {
      let endRow = startRow + 1;
      while (endRow < rows && board[endRow][col].kind === board[startRow][col].kind) {
        endRow += 1;
      }

      if (endRow - startRow >= 3) {
        groups.push({
          positions: Array.from({ length: endRow - startRow }, (_, index) => ({
            row: startRow + index,
            col,
          })),
          orientation: "vertical",
        });
      }

      startRow = endRow;
    }
  }

  return groups;
}

function chooseSpecialSpawnPosition(
  group: MatchGroup,
  preferredPosition: Match3Position | null,
): Match3Position {
  if (preferredPosition) {
    const preferred = group.positions.find((position) => samePosition(position, preferredPosition));
    if (preferred) {
      return preferred;
    }
  }

  return group.positions[Math.floor(group.positions.length / 2)];
}

function collectMatchedIds(board: Match3Tile[][], groups: MatchGroup[]): Set<string> {
  const matchedIds = new Set<string>();

  for (const group of groups) {
    for (const position of group.positions) {
      matchedIds.add(board[position.row][position.col].id);
    }
  }

  return matchedIds;
}

function createSpecialSpawns(
  board: Match3Tile[][],
  groups: MatchGroup[],
  preferredPosition: Match3Position | null,
): SpecialSpawn[] {
  const usedPositions = new Set<string>();
  const spawns: SpecialSpawn[] = [];
  const sortedGroups = [...groups].sort((a, b) => b.positions.length - a.positions.length);

  for (const group of sortedGroups) {
    if (group.positions.length < 4) {
      continue;
    }

    const spawnPosition = chooseSpecialSpawnPosition(group, preferredPosition);
    const key = makePositionKey(spawnPosition);
    if (usedPositions.has(key)) {
      continue;
    }

    usedPositions.add(key);
    spawns.push({
      position: spawnPosition,
      kind: board[spawnPosition.row][spawnPosition.col].kind,
      special:
        group.positions.length >= 5
          ? "bomb"
          : group.orientation === "horizontal"
            ? "rowClear"
            : "colClear",
    });
  }

  return spawns;
}

function applySpecialCreation(
  board: Match3Tile[][],
  matchedIds: Set<string>,
  spawns: SpecialSpawn[],
): number {
  let generatedCount = 0;

  for (const spawn of spawns) {
    const tile = board[spawn.position.row][spawn.position.col];
    matchedIds.delete(tile.id);
    board[spawn.position.row][spawn.position.col] = {
      ...tile,
      special: spawn.special,
    };
    generatedCount += 1;
  }

  return generatedCount;
}

function expandSpecialEffects(board: Match3Tile[][], matchedIds: Set<string>): number {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const activated = new Set<string>();

  let changed = true;
  while (changed) {
    changed = false;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const tile = board[row][col];

        if (!matchedIds.has(tile.id) || !tile.special || activated.has(tile.id)) {
          continue;
        }

        activated.add(tile.id);

        if (tile.special === "rowClear") {
          for (let clearCol = 0; clearCol < cols; clearCol += 1) {
            const target = board[row][clearCol];
            if (!matchedIds.has(target.id)) {
              matchedIds.add(target.id);
              changed = true;
            }
          }
        }

        if (tile.special === "colClear") {
          for (let clearRow = 0; clearRow < rows; clearRow += 1) {
            const target = board[clearRow][col];
            if (!matchedIds.has(target.id)) {
              matchedIds.add(target.id);
              changed = true;
            }
          }
        }

        if (tile.special === "bomb") {
          for (let targetRow = row - 1; targetRow <= row + 1; targetRow += 1) {
            for (let targetCol = col - 1; targetCol <= col + 1; targetCol += 1) {
              if (
                targetRow < 0 ||
                targetRow >= rows ||
                targetCol < 0 ||
                targetCol >= cols
              ) {
                continue;
              }

              const target = board[targetRow][targetCol];
              if (!matchedIds.has(target.id)) {
                matchedIds.add(target.id);
                changed = true;
              }
            }
          }
        }
      }
    }
  }

  return activated.size;
}

function collapseBoard(board: Match3Tile[][], matchedIds: Set<string>, kinds: TileKind[]): Match3Tile[][] {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const nextBoard: Match3Tile[][] = Array.from({ length: rows }, () => Array.from({ length: cols }));

  for (let col = 0; col < cols; col += 1) {
    const survivors: Match3Tile[] = [];

    for (let row = rows - 1; row >= 0; row -= 1) {
      const tile = board[row][col];
      if (!matchedIds.has(tile.id)) {
        survivors.push(tile);
      }
    }

    let writeRow = rows - 1;

    for (const tile of survivors) {
      nextBoard[writeRow][col] = tile;
      writeRow -= 1;
    }

    while (writeRow >= 0) {
      nextBoard[writeRow][col] = createTile(randomKind(kinds));
      writeRow -= 1;
    }
  }

  return nextBoard;
}

function collectClearedKinds(board: Match3Tile[][], matchedIds: Set<string>): TileKind[] {
  const clearedKinds: TileKind[] = [];

  for (const row of board) {
    for (const tile of row) {
      if (matchedIds.has(tile.id)) {
        clearedKinds.push(tile.kind);
      }
    }
  }

  return clearedKinds;
}

function resolveBoard(
  board: Match3Tile[][],
  config: Match3Config,
  preferredSpecialPosition: Match3Position | null,
): Match3MoveResult {
  let currentBoard = cloneBoard(board);
  let totalCleared = 0;
  let generatedSpecialCount = 0;
  let activatedSpecialCount = 0;
  let currentPreferredPosition = preferredSpecialPosition;
  let effectClearedIds: string[] = [];
  let allClearedKinds: TileKind[] = [];

  while (true) {
    const groups = collectMatchGroups(currentBoard);

    if (groups.length === 0) {
      return {
        board: currentBoard,
        clearedCount: totalCleared,
        clearedIds: effectClearedIds,
        clearedKinds: allClearedKinds,
        matched: totalCleared > 0,
        generatedSpecialCount,
        activatedSpecialCount,
      };
    }

    const matchedIds = collectMatchedIds(currentBoard, groups);
    const spawns = createSpecialSpawns(currentBoard, groups, currentPreferredPosition);

    generatedSpecialCount += applySpecialCreation(currentBoard, matchedIds, spawns);
    activatedSpecialCount += expandSpecialEffects(currentBoard, matchedIds);

    const currentClearedKinds = collectClearedKinds(currentBoard, matchedIds);
    allClearedKinds = [...allClearedKinds, ...currentClearedKinds];

    if (effectClearedIds.length === 0) {
      effectClearedIds = Array.from(matchedIds);
    }

    totalCleared += matchedIds.size;
    currentBoard = collapseBoard(currentBoard, matchedIds, config.tileKinds);
    currentPreferredPosition = null;
  }
}

export function applyMove(
  board: Match3Tile[][],
  a: Match3Position,
  b: Match3Position,
  config: Match3Config,
): Match3MoveResult {
  if (!areAdjacent(a, b)) {
    return {
      board,
      clearedCount: 0,
      clearedIds: [],
      clearedKinds: [],
      matched: false,
      generatedSpecialCount: 0,
      activatedSpecialCount: 0,
    };
  }

  const swapped = swapTiles(board, a, b);
  const resolved = resolveBoard(swapped, config, b);

  if (!resolved.matched) {
    return {
      board,
      clearedCount: 0,
      clearedIds: [],
      clearedKinds: [],
      matched: false,
      generatedSpecialCount: 0,
      activatedSpecialCount: 0,
    };
  }

  return resolved;
}

export function activateSpecialTile(
  board: Match3Tile[][],
  position: Match3Position,
  config: Match3Config,
): Match3MoveResult {
  const tile = board[position.row]?.[position.col];

  if (!tile?.special) {
    return {
      board,
      clearedCount: 0,
      clearedIds: [],
      clearedKinds: [],
      matched: false,
      generatedSpecialCount: 0,
      activatedSpecialCount: 0,
    };
  }

  const currentBoard = cloneBoard(board);
  const matchedIds = new Set<string>([currentBoard[position.row][position.col].id]);
  const activatedSpecialCount = expandSpecialEffects(currentBoard, matchedIds);
  const clearedKinds = collectClearedKinds(currentBoard, matchedIds);
  const clearedCount = matchedIds.size;
  const clearedIds = Array.from(matchedIds);
  const collapsedBoard = collapseBoard(currentBoard, matchedIds, config.tileKinds);

  return {
    board: collapsedBoard,
    clearedCount,
    clearedIds,
    clearedKinds,
    matched: true,
    generatedSpecialCount: 0,
    activatedSpecialCount,
  };
}

export function boardHasPossibleMove(board: Match3Tile[][]): boolean {
  return findFirstPossibleMove(board) !== null;
}

export function findFirstPossibleMove(board: Match3Tile[][]): Match3Hint | null {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const current = { row, col };

      if (col + 1 < cols) {
        const right = { row, col: col + 1 };
        const swapped = swapTiles(board, current, right);
        if (collectMatchGroups(swapped).length > 0) {
          return {
            from: current,
            to: right,
          };
        }
      }

      if (row + 1 < rows) {
        const down = { row: row + 1, col };
        const swapped = swapTiles(board, current, down);
        if (collectMatchGroups(swapped).length > 0) {
          return {
            from: current,
            to: down,
          };
        }
      }
    }
  }

  return null;
}

export function createPlayableBoard(config: Match3Config): Match3Tile[][] {
  let board = createInitialBoard(config);
  let guard = 0;

  while (!boardHasPossibleMove(board) && guard < 50) {
    board = createInitialBoard(config);
    guard += 1;
  }

  return board;
}

export function countInitialPotentialMatches(board: Match3Tile[][]): number {
  let count = 0;
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (hasImmediateMatch(board, row, col)) {
        count += 1;
      }
    }
  }

  return count;
}

export function countSpecialTiles(board: Match3Tile[][]): number {
  return board.flat().filter((tile) => Boolean(tile.special)).length;
}

export function shufflePlayableBoard(board: Match3Tile[][], config: Match3Config): Match3Tile[][] {
  const sourceTiles = cloneTileList(board);
  let guard = 0;

  while (guard < 200) {
    const shuffledBoard = rebuildBoard(config.rows, config.cols, shuffleTiles(sourceTiles));

    if (countInitialPotentialMatches(shuffledBoard) === 0 && boardHasPossibleMove(shuffledBoard)) {
      return shuffledBoard;
    }

    guard += 1;
  }

  return createPlayableBoard(config);
}

export function settleRemainingSpecialTiles(board: Match3Tile[][]): {
  remainingSpecialTiles: number;
  explodedTileCount: number;
  activatedSpecialCount: number;
} {
  const currentBoard = cloneBoard(board);
  const matchedIds = new Set<string>();

  for (const tile of currentBoard.flat()) {
    if (tile.special) {
      matchedIds.add(tile.id);
    }
  }

  if (matchedIds.size === 0) {
    return {
      remainingSpecialTiles: 0,
      explodedTileCount: 0,
      activatedSpecialCount: 0,
    };
  }

  const remainingSpecialTiles = matchedIds.size;
  const activatedSpecialCount = expandSpecialEffects(currentBoard, matchedIds);

  return {
    remainingSpecialTiles,
    explodedTileCount: matchedIds.size,
    activatedSpecialCount,
  };
}
