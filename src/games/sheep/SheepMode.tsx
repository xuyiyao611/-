import { useEffect, useMemo, useRef, useState } from "react";
import { sheepConfigs } from "@/games/sheep/sheepConfig";
import {
  createCardsForBoard,
  createTraySlots,
  getGameOutcome,
  isCardBlocked,
  moveCardToTray,
} from "@/games/sheep/sheepLogic";
import type { SheepCard, SheepKind } from "@/games/sheep/sheepTypes";
import type { Difficulty, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type SheepModeProps = {
  session: GameSession;
  difficulty: Difficulty;
  onFinish: (payload: ResultPayload) => void;
};

const kindLabels: Record<SheepKind, string> = {
  bun: "BUN",
  bell: "BELL",
  leaf: "LEAF",
  gem: "GEM",
};

const defaultHint = "只能拿取当前未被遮挡的顶层卡牌，凑齐三张相同卡牌会自动消除。";

export function SheepMode({ session, difficulty, onFinish }: SheepModeProps) {
  const config = sheepConfigs[difficulty];
  const [cards, setCards] = useState<SheepCard[]>(() => createCardsForBoard(config));
  const [trayCardIds, setTrayCardIds] = useState<string[]>([]);
  const [statusText, setStatusText] = useState(defaultHint);
  const finishedRef = useRef(false);

  const boardCards = useMemo(() => cards.filter((card) => card.status === "board"), [cards]);
  const trayCards = useMemo(
    () =>
      trayCardIds
        .map((id) => cards.find((card) => card.id === id))
        .filter((card): card is SheepCard => Boolean(card)),
    [cards, trayCardIds],
  );
  const traySlots = useMemo(() => createTraySlots(config.slotLimit, trayCardIds), [config.slotLimit, trayCardIds]);

  useEffect(() => {
    setCards(createCardsForBoard(config));
    setTrayCardIds([]);
    setStatusText(defaultHint);
    finishedRef.current = false;
  }, [config, session.runId]);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    const outcome = getGameOutcome(cards, trayCardIds, config.slotLimit);
    if (outcome === "win") {
      finishedRef.current = true;
      onFinish({
        status: "win",
        title: "羊了个羊胜利",
        description: `你成功清空了全部卡牌，剩余槽位 ${config.slotLimit - trayCardIds.length}。`,
      });
      return;
    }

    if (outcome === "lose") {
      finishedRef.current = true;
      onFinish({
        status: "lose",
        title: "羊了个羊失败",
        description: "槽位已满，还没来得及凑成三张相同卡牌。",
      });
    }
  }, [cards, config.slotLimit, onFinish, trayCardIds]);

  function handleCardClick(cardId: string) {
    if (finishedRef.current) {
      return;
    }

    const resolved = moveCardToTray(cards, trayCardIds, cardId);
    if (resolved.failureReason === "blocked") {
      setStatusText("这张牌当前仍被其他牌堆挡住，需要先拆掉上方或相邻压住它的卡牌。");
      return;
    }

    if (resolved.failureReason === "unavailable") {
      setStatusText("这张牌已经进入槽位或已被消除，本回合不能重复操作。");
      return;
    }

    if (resolved.failureReason === "missing") {
      setStatusText("未找到目标卡牌，本次点击已忽略。");
      return;
    }

    setCards(resolved.cards);
    setTrayCardIds(resolved.trayCardIds);

    if (resolved.clearedCount > 0) {
      setStatusText(`已消除 ${resolved.clearedKinds.join(" / ")} 组合，继续拆解上层卡牌。`);
      return;
    }

    setStatusText(`卡牌已进入槽位，当前占用 ${resolved.trayCardIds.length} / ${config.slotLimit}。`);
  }

  return (
    <section className="mode-shell">
      <header className="mode-header">
        <div>
          <p className="mode-kicker">卡牌 / {difficulty === "easy" ? "简单" : "困难"}</p>
          <h2>羊了个羊 - {config.title}</h2>
        </div>
        <div className="mode-badge-group">
          <span>运行编号 #{session.runId}</span>
          <span>槽位上限 {config.slotLimit}</span>
          <span>剩余卡牌 {boardCards.length}</span>
        </div>
      </header>

      <div className="mode-grid">
        <article className="mode-card">
          <h3>布局目标</h3>
          <p>{config.intro}</p>
        </article>
        <article className="mode-card">
          <h3>当前规则</h3>
          <ul className="mode-list">
            <li>卡牌分布在不同区域，区域之间会形成交叉遮挡。</li>
            <li>每个牌堆只能先取最顶层的卡牌。</li>
            <li>被其他卡牌压住的牌不能直接拿取。</li>
            <li>凑齐三张相同卡牌会自动消除。</li>
          </ul>
        </article>
      </div>

      <div className="match3-status-panel">
        <div className="status-strip">
          <span>剩余卡牌 {boardCards.length}</span>
          <span className="status-pill-strong">
            槽位 {trayCards.length} / {config.slotLimit}
          </span>
          <span>区域数量 {config.zones.length}</span>
        </div>
        <p className="match3-hint">{statusText}</p>
      </div>

      <div
        className={`sheep-board sheep-board-${difficulty}`}
        style={{
          width: `${config.boardWidth}px`,
          minHeight: `${config.boardHeight}px`,
        }}
      >
        <div className="sheep-board-glow" />
        {boardCards.map((card) => {
          const blocked = isCardBlocked(cards, card.id);

          return (
            <button
              key={card.id}
              aria-label={`sheep-card-${card.id}-${card.kind}`}
              className={`sheep-card sheep-${card.kind}${blocked ? " sheep-card-blocked" : " sheep-card-open"}`}
              onClick={() => handleCardClick(card.id)}
              style={{
                left: `${card.x}px`,
                top: `${card.y}px`,
                width: `${config.cardWidth}px`,
                height: `${config.cardHeight}px`,
                zIndex: card.depth * 20 + Math.round(card.y),
                transform: `rotate(${card.tilt}deg)`,
              }}
              type="button"
            >
              <span className="sheep-card-face" />
              <span className="sheep-card-label">{kindLabels[card.kind]}</span>
            </button>
          );
        })}
      </div>

      <div className="sheep-tray">
        {traySlots.map((slot) => {
          const card = slot.cardId ? cards.find((item) => item.id === slot.cardId) : null;

          return (
            <div key={`tray-slot-${slot.index}`} className="sheep-tray-slot">
              {card ? (
                <div className={`sheep-tray-card sheep-${card.kind}`}>
                  <span className="sheep-card-face" />
                  <span className="sheep-card-label">{kindLabels[card.kind]}</span>
                </div>
              ) : (
                <span className="sheep-tray-placeholder">空</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
