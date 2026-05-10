import type {
  Match3Config,
  Match3MoveResult,
  Match3Position,
  Match3Tile,
  TileKind,
} from "@/games/match3/match3Types";

let nextTileId = 0;

function createTile(kind: TileKind): Match3Tile {
  nextTileId += 1;
  return {
    id: `tile-${nextTileId}`,
    kind,
  };
}

function cloneBoard(board: Match3Tile[][]): Match3Tile[][] {
  return board.map((row) => row.map((tile) => ({ ...tile })));
}

function randomKind(kinds: TileKind[]): TileKind {
  const index = Math.floor(Math.random() * kinds.length);
  return kinds[index];
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

function collectMatches(board: Match3Tile[][]): Set<string> {
  const matchedIds = new Set<string>();
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
        for (let col = startCol; col < endCol; col += 1) {
          matchedIds.add(board[row][col].id);
        }
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
        for (let row = startRow; row < endRow; row += 1) {
          matchedIds.add(board[row][col].id);
        }
      }

      startRow = endRow;
    }
  }

  return matchedIds;
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

function resolveBoard(board: Match3Tile[][], config: Match3Config): Match3MoveResult {
  let currentBoard = cloneBoard(board);
  let totalCleared = 0;

  while (true) {
    const matches = collectMatches(currentBoard);
    if (matches.size === 0) {
      return {
        board: currentBoard,
        clearedCount: totalCleared,
        matched: totalCleared > 0,
      };
    }

    totalCleared += matches.size;
    currentBoard = collapseBoard(currentBoard, matches, config.tileKinds);
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
      matched: false,
    };
  }

  const swapped = swapTiles(board, a, b);
  const resolved = resolveBoard(swapped, config);

  if (!resolved.matched) {
    return {
      board,
      clearedCount: 0,
      matched: false,
    };
  }

  return resolved;
}

export function boardHasPossibleMove(board: Match3Tile[][]): boolean {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const current = { row, col };

      if (col + 1 < cols) {
        const swapped = swapTiles(board, current, { row, col: col + 1 });
        if (collectMatches(swapped).size > 0) {
          return true;
        }
      }

      if (row + 1 < rows) {
        const swapped = swapTiles(board, current, { row: row + 1, col });
        if (collectMatches(swapped).size > 0) {
          return true;
        }
      }
    }
  }

  return false;
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
