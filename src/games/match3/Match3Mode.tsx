import { useEffect, useMemo, useState } from "react";
import { getMatch3Config } from "@/games/match3/match3Config";
import { applyMove, createPlayableBoard } from "@/games/match3/match3Logic";
import type { Match3Position, Match3Tile, TileKind } from "@/games/match3/match3Types";
import type { Difficulty, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type Match3ModeProps = {
  session: GameSession;
  difficulty: Difficulty;
  onFinish: (payload: ResultPayload) => void;
};

const tileLabels: Record<TileKind, string> = {
  sun: "SUN",
  leaf: "LEAF",
  drop: "DROP",
  berry: "BERRY",
  star: "STAR",
};

function isSamePosition(a: Match3Position | null, b: Match3Position): boolean {
  return Boolean(a && a.row === b.row && a.col === b.col);
}

export function Match3Mode({ session, difficulty, onFinish }: Match3ModeProps) {
  const config = useMemo(() => getMatch3Config(difficulty), [difficulty]);
  const [board, setBoard] = useState<Match3Tile[][]>(() => createPlayableBoard(config));
  const [selected, setSelected] = useState<Match3Position | null>(null);
  const [movesLeft, setMovesLeft] = useState(config.moveLimit);
  const [score, setScore] = useState(0);
  const [statusText, setStatusText] = useState("请选择一个方块，再点击相邻方块进行交换。");

  useEffect(() => {
    setBoard(createPlayableBoard(config));
    setSelected(null);
    setMovesLeft(config.moveLimit);
    setScore(0);
    setStatusText("请选择一个方块，再点击相邻方块进行交换。");
  }, [config, session.runId]);

  useEffect(() => {
    if (score >= config.targetScore) {
      onFinish({
        status: "win",
        title: "开心消消乐胜利",
        description: `你在 ${config.moveLimit - movesLeft} 步内完成了 ${difficulty === "hard" ? "困难模式" : "简单模式"} 的目标分数。`,
      });
      return;
    }

    if (movesLeft <= 0) {
      onFinish({
        status: "lose",
        title: "开心消消乐失败",
        description: `步数已用尽，当前分数 ${score}，目标分数 ${config.targetScore}。`,
      });
    }
  }, [config.moveLimit, config.targetScore, difficulty, movesLeft, onFinish, score]);

  const progressText = useMemo(() => {
    return `分数 ${score} / ${config.targetScore}`;
  }, [config.targetScore, score]);

  const difficultyText = difficulty === "hard" ? "困难" : "简单";

  function handleTileClick(position: Match3Position) {
    if (movesLeft <= 0) {
      return;
    }

    if (!selected) {
      setSelected(position);
      setStatusText("已选中一个方块，请选择相邻方块完成交换。");
      return;
    }

    if (isSamePosition(selected, position)) {
      setSelected(null);
      setStatusText("已取消当前选择。");
      return;
    }

    const moveResult = applyMove(board, selected, position, config);

    if (!moveResult.matched) {
      setSelected(position);
      setStatusText("这次交换无法形成消除，请重新选择相邻方块。");
      return;
    }

    setBoard(moveResult.board);
    setSelected(null);
    setMovesLeft((value) => value - 1);
    setScore((value) => value + moveResult.clearedCount * 20);
    setStatusText(`成功消除了 ${moveResult.clearedCount} 个方块。`);
  }

  return (
    <section className="mode-shell">
      <header className="mode-header">
        <div>
          <p className="mode-kicker">三消 / {difficultyText}</p>
          <h2>开心消消乐 - {difficultyText}模式</h2>
        </div>
        <div className="mode-badge-group">
          <span>运行编号 #{session.runId}</span>
          <span>目标 {config.targetScore} 分</span>
          <span>剩余步数 {movesLeft}</span>
        </div>
      </header>

      <div className="mode-grid">
        <article className="mode-card">
          <h3>本阶段已接入</h3>
          <ul className="mode-list">
            <li>棋盘生成</li>
            <li>相邻交换</li>
            <li>三连消除</li>
            <li>掉落补位</li>
            <li>基础胜负判定</li>
          </ul>
        </article>
        <article className="mode-card">
          <h3>当前模式特征</h3>
          <ul className="mode-list">
            <li>棋盘大小：{config.rows} x {config.cols}</li>
            <li>元素种类：{config.tileKinds.length} 种</li>
            <li>目标分数：{config.targetScore}</li>
            <li>步数限制：{config.moveLimit}</li>
          </ul>
        </article>
      </div>

      <div className="match3-status-panel">
        <div className="status-strip">
          <span>{progressText}</span>
          <span>
            棋盘 {config.rows} x {config.cols}
          </span>
          <span>元素 {config.tileKinds.length} 种</span>
        </div>
        <p className="match3-hint">{statusText}</p>
      </div>

      <div
        className="match3-board"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const active = isSamePosition(selected, { row: rowIndex, col: colIndex });

            return (
              <button
                key={tile.id}
                aria-label={`tile-${rowIndex}-${colIndex}-${tile.kind}`}
                className={`match3-tile match3-${tile.kind}${active ? " match3-tile-active" : ""}`}
                onClick={() => handleTileClick({ row: rowIndex, col: colIndex })}
                type="button"
              >
                <span className="match3-tile-icon">{tileLabels[tile.kind]}</span>
              </button>
            );
          }),
        )}
      </div>
    </section>
  );
}
