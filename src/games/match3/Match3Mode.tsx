import { useEffect, useMemo, useRef, useState } from "react";
import { tileVisuals } from "@/games/match3/match3Assets";
import { getMatch3Config } from "@/games/match3/match3Config";
import {
  activateSpecialTile,
  applyMove,
  boardHasPossibleMove,
  countSpecialTiles,
  createPlayableBoard,
  findFirstPossibleMove,
  settleRemainingSpecialTiles,
  shufflePlayableBoard,
} from "@/games/match3/match3Logic";
import type {
  Match3Hint,
  Match3Position,
  Match3SpecialType,
  Match3Tile,
  TileKind,
} from "@/games/match3/match3Types";
import type {
  ClearedElementStats,
  Difficulty,
  ResultPayload,
  RewardSettlement,
} from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type Match3ModeProps = {
  session: GameSession;
  difficulty: Difficulty;
  coins: number;
  onSpendCoins: (amount: number) => void;
  onFinish: (payload: ResultPayload) => void;
};

const specialLabels: Record<Match3SpecialType, string> = {
  rowClear: "ROW",
  colClear: "COL",
  bomb: "BOOM",
};

const SCORE_PER_TILE = 20;
const SCORE_PER_MOVE_LEFT = 100;
const SCORE_TO_COIN_DIVISOR = 100;
const TOOL_COST = 5;

function createEmptyStats(): ClearedElementStats {
  return {
    sun: 0,
    leaf: 0,
    drop: 0,
    berry: 0,
    star: 0,
    candy: 0,
    sprout: 0,
    puff: 0,
  };
}

function accumulateClearedKinds(stats: ClearedElementStats, kinds: TileKind[]): ClearedElementStats {
  const next = { ...stats };

  for (const kind of kinds) {
    next[kind] += 1;
  }

  return next;
}

function isSamePosition(a: Match3Position | null, b: Match3Position): boolean {
  return Boolean(a && a.row === b.row && a.col === b.col);
}

function isHintPosition(hint: Match3Hint | null, position: Match3Position): boolean {
  return Boolean(
    hint &&
      ((hint.from.row === position.row && hint.from.col === position.col) ||
        (hint.to.row === position.row && hint.to.col === position.col)),
  );
}

function getHintRole(hint: Match3Hint | null, position: Match3Position): "from" | "to" | null {
  if (!hint) {
    return null;
  }

  if (hint.from.row === position.row && hint.from.col === position.col) {
    return "from";
  }

  if (hint.to.row === position.row && hint.to.col === position.col) {
    return "to";
  }

  return null;
}

function getHintArrow(hint: Match3Hint | null, position: Match3Position): string | null {
  if (!hint) {
    return null;
  }

  if (hint.from.row === position.row && hint.from.col === position.col) {
    if (hint.to.row === hint.from.row) {
      return hint.to.col > hint.from.col ? "→" : "←";
    }

    return hint.to.row > hint.from.row ? "↓" : "↑";
  }

  if (hint.to.row === position.row && hint.to.col === position.col) {
    return "换";
  }

  return null;
}

export function Match3Mode({
  session,
  difficulty,
  coins,
  onSpendCoins,
  onFinish,
}: Match3ModeProps) {
  const config = useMemo(() => getMatch3Config(difficulty), [difficulty]);
  const [board, setBoard] = useState<Match3Tile[][]>(() => createPlayableBoard(config));
  const [selected, setSelected] = useState<Match3Position | null>(null);
  const [hint, setHint] = useState<Match3Hint | null>(null);
  const [movesLeft, setMovesLeft] = useState(config.moveLimit);
  const [score, setScore] = useState(0);
  const [clearedStats, setClearedStats] = useState<ClearedElementStats>(createEmptyStats);
  const [statusText, setStatusText] = useState("请选择一个方块，再点击相邻方块进行交换。");
  const [clearingIds, setClearingIds] = useState<string[]>([]);
  const finishTriggeredRef = useRef(false);

  useEffect(() => {
    setBoard(createPlayableBoard(config));
    setSelected(null);
    setHint(null);
    setMovesLeft(config.moveLimit);
    setScore(0);
    setClearedStats(createEmptyStats());
    setStatusText("请选择一个方块，再点击相邻方块进行交换。");
    setClearingIds([]);
    finishTriggeredRef.current = false;
  }, [config, session.runId]);

  useEffect(() => {
    if (clearingIds.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setClearingIds([]);
    }, 280);

    return () => {
      window.clearTimeout(timer);
    };
  }, [clearingIds]);

  useEffect(() => {
    if (finishTriggeredRef.current || clearingIds.length > 0 || score >= config.targetScore || movesLeft <= 0) {
      return;
    }

    if (boardHasPossibleMove(board)) {
      return;
    }

    setBoard(shufflePlayableBoard(board, config));
    setSelected(null);
    setHint(null);
    setStatusText("当前棋盘暂无可用步法，已自动重新洗牌。");
  }, [board, clearingIds.length, config, movesLeft, score]);

  useEffect(() => {
    if (finishTriggeredRef.current) {
      return;
    }

    if (score >= config.targetScore) {
      finishTriggeredRef.current = true;

      const remainingMoves = movesLeft;
      const moveBonusScore = remainingMoves * SCORE_PER_MOVE_LEFT;
      const specialSettlement = settleRemainingSpecialTiles(board);
      const specialBonusScore = specialSettlement.explodedTileCount * SCORE_PER_TILE;
      const finalScore = score + moveBonusScore + specialBonusScore;
      const settlement: RewardSettlement = {
        baseScore: score,
        moveBonusScore,
        specialBonusScore,
        finalScore,
        coinReward: Math.floor(finalScore / SCORE_TO_COIN_DIVISOR),
        rewardGranted: true,
        remainingMoves,
        remainingSpecialTiles: specialSettlement.remainingSpecialTiles,
        explodedTileCount: specialSettlement.explodedTileCount,
        activatedSpecialCount: specialSettlement.activatedSpecialCount,
        clearedElements: clearedStats,
        fragmentGains: clearedStats,
        selectedTileKinds: config.tileKinds,
      };

      onFinish({
        status: "win",
        title: "角落消消胜利",
        description: `你在 ${config.moveLimit - movesLeft} 步内完成了${difficulty === "hard" ? "困难模式" : "简单模式"}的目标分数。`,
        settlement,
      });
      return;
    }

    if (movesLeft <= 0) {
      finishTriggeredRef.current = true;

      onFinish({
        status: "lose",
        title: "角落消消失败",
        description: `步数已经用完，当前分数 ${score}，目标分数 ${config.targetScore}。`,
        settlement: {
          baseScore: score,
          moveBonusScore: 0,
          specialBonusScore: 0,
          finalScore: score,
          coinReward: 0,
          rewardGranted: false,
          remainingMoves: 0,
          remainingSpecialTiles: 0,
          explodedTileCount: 0,
          activatedSpecialCount: 0,
          clearedElements: clearedStats,
          fragmentGains: clearedStats,
          selectedTileKinds: config.tileKinds,
        },
      });
    }
  }, [board, clearedStats, config, difficulty, movesLeft, onFinish, score]);

  const progressText = useMemo(() => {
    return `分数 ${score} / ${config.targetScore}`;
  }, [config.targetScore, score]);

  const difficultyText = difficulty === "hard" ? "困难" : "简单";
  const specialTilesLeft = useMemo(() => countSpecialTiles(board), [board]);
  const toolsDisabled = coins < TOOL_COST || movesLeft <= 0 || finishTriggeredRef.current;

  function applyScoreDelta(clearedCount: number, clearedKinds: TileKind[]) {
    setScore((value) => value + clearedCount * SCORE_PER_TILE);
    setClearedStats((value) => accumulateClearedKinds(value, clearedKinds));
  }

  function spendToolCoins(actionName: string): boolean {
    if (coins < TOOL_COST) {
      setStatusText(`${actionName}需要 ${TOOL_COST} 金币，当前金币不足。`);
      return false;
    }

    onSpendCoins(TOOL_COST);
    return true;
  }

  function handleShuffle() {
    if (toolsDisabled) {
      return;
    }

    if (!spendToolCoins("洗牌")) {
      return;
    }

    setBoard(shufflePlayableBoard(board, config));
    setSelected(null);
    setHint(null);
    setStatusText(`已消耗 ${TOOL_COST} 金币完成洗牌，请继续寻找新的消除组合。`);
  }

  function handleHint() {
    if (toolsDisabled) {
      return;
    }

    if (!spendToolCoins("提示")) {
      return;
    }

    const nextHint = findFirstPossibleMove(board);
    setHint(nextHint);

    if (!nextHint) {
      setStatusText("未找到可用提示，棋盘将等待自动重排。");
      return;
    }

    setSelected(null);
    setStatusText(
      `已消耗 ${TOOL_COST} 金币获得提示：交换 (${nextHint.from.row + 1}, ${nextHint.from.col + 1}) 和 (${nextHint.to.row + 1}, ${nextHint.to.col + 1})。`,
    );
  }

  function handleTileClick(position: Match3Position) {
    if (movesLeft <= 0 || finishTriggeredRef.current) {
      return;
    }

    const clickedTile = board[position.row][position.col];
    setHint(null);

    if (!selected && clickedTile.special === "bomb") {
      const moveResult = activateSpecialTile(board, position, config);
      setClearingIds(moveResult.clearedIds);
      window.setTimeout(() => {
        setBoard(moveResult.board);
        setMovesLeft((value) => value - 1);
        applyScoreDelta(moveResult.clearedCount, moveResult.clearedKinds);
      }, 220);
      setStatusText("已触发九宫格爆炸元素。");
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

    setClearingIds(moveResult.clearedIds);
    setSelected(null);
    window.setTimeout(() => {
      setBoard(moveResult.board);
      setMovesLeft((value) => value - 1);
      applyScoreDelta(moveResult.clearedCount, moveResult.clearedKinds);
    }, 220);

    if (moveResult.generatedSpecialCount > 0) {
      setStatusText(`成功生成了 ${moveResult.generatedSpecialCount} 个特殊元素。`);
      return;
    }

    if (moveResult.activatedSpecialCount > 0) {
      setStatusText(`触发了 ${moveResult.activatedSpecialCount} 个特殊元素。`);
      return;
    }

    setStatusText(`成功消除了 ${moveResult.clearedCount} 个方块。`);
  }

  return (
    <section className="mode-shell">
      <header className="mode-header">
        <div>
          <p className="mode-kicker">三消 / {difficultyText}</p>
          <h2>角落消消 - {difficultyText}模式</h2>
        </div>
        <div className="mode-badge-group">
          <span>运行编号 #{session.runId}</span>
          <span>目标 {config.targetScore} 分</span>
          <span>剩余步数 {movesLeft}</span>
          <span>金币 {coins}</span>
        </div>
      </header>

      <div className="mode-grid">
        <article className="mode-card">
          <h3>本阶段已接入</h3>
          <ul className="mode-list">
            <li>9 x 9 棋盘</li>
            <li>每局只出现 6 类元素</li>
            <li>单局元素消除统计</li>
            <li>碎片收集与角色兑换</li>
            <li>只有挑战成功才会发放碎片和金币奖励</li>
            <li>提示与洗牌各消耗 5 金币</li>
            <li>提示箭头与目标格标记</li>
          </ul>
        </article>
        <article className="mode-card">
          <h3>当前模式特征</h3>
          <ul className="mode-list">
            <li>棋盘大小：{config.rows} x {config.cols}</li>
            <li>本局元素：{config.tileKinds.length} 种</li>
            <li>目标分数：{config.targetScore}</li>
            <li>步数限制：{config.moveLimit}</li>
            <li>碎片规则：挑战成功后，每消除 1 个元素获得 1 个对应碎片</li>
            <li>兑换规则：200 碎片兑换 1 个角色</li>
            <li>工具费用：提示 5 金币 / 洗牌 5 金币</li>
          </ul>
        </article>
      </div>

      <div className="match3-status-panel">
        <div className="status-strip">
          <span>{progressText}</span>
          <span className="status-pill-strong">剩余步数 {movesLeft}</span>
          <span>棋盘 {config.rows} x {config.cols}</span>
          <span>本局元素 {config.tileKinds.length} 种</span>
          <span>特殊元素 {specialTilesLeft}</span>
          <span>金币 {coins}</span>
        </div>
        <p className="match3-hint">{statusText}</p>
      </div>

      <div className="button-row match3-toolbar">
        <button
          className="secondary-button"
          disabled={toolsDisabled}
          onClick={handleHint}
          type="button"
        >
          提示 -5 金币
        </button>
        <button
          className="secondary-button"
          disabled={toolsDisabled}
          onClick={handleShuffle}
          type="button"
        >
          洗牌 -5 金币
        </button>
      </div>

      <div
        className="match3-board"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((tile, colIndex) => {
            const currentPosition = { row: rowIndex, col: colIndex };
            const active = isSamePosition(selected, currentPosition);
            const hinted = isHintPosition(hint, currentPosition);
            const hintRole = getHintRole(hint, currentPosition);
            const hintArrow = getHintArrow(hint, currentPosition);
            const clearing = clearingIds.includes(tile.id);
            const tileVisual = tileVisuals[tile.kind];

            return (
              <button
                key={tile.id}
                aria-label={`tile-${rowIndex}-${colIndex}-${tile.kind}${tile.special ? `-${tile.special}` : ""}`}
                className={`match3-tile match3-${tile.kind}${tile.special ? " match3-special-tile" : ""}${active ? " match3-tile-active" : ""}${hinted ? " match3-tile-hint" : ""}${clearing ? " match3-tile-clearing" : ""}`}
                onClick={() => handleTileClick(currentPosition)}
                title={tileVisual.label}
                type="button"
              >
                <img
                  alt={tileVisual.label}
                  className="match3-tile-image"
                  draggable={false}
                  src={tileVisual.image}
                />
                {hintArrow ? (
                  <span
                    className={`match3-hint-arrow${hintRole === "to" ? " match3-hint-arrow-target" : ""}`}
                  >
                    {hintArrow}
                  </span>
                ) : null}
                {tile.special ? (
                  <span className="match3-special-badge">{specialLabels[tile.special]}</span>
                ) : null}
              </button>
            );
          }),
        )}
      </div>
    </section>
  );
}
