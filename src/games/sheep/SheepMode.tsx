import { useEffect, useRef, useState } from "react";
import { sheepEasyConfig } from "@/games/sheep/sheepConfig";
import { allCardsCleared, cloneCards, isCardBlocked, removeTrayTriples } from "@/games/sheep/sheepLogic";
import type { SheepCard, SheepKind } from "@/games/sheep/sheepTypes";
import type { ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type SheepModeProps = {
  session: GameSession;
  onFinish: (payload: ResultPayload) => void;
};

const kindLabels: Record<SheepKind, string> = {
  bun: "BUN",
  bell: "BELL",
  leaf: "LEAF",
  gem: "GEM",
};

export function SheepMode({ session, onFinish }: SheepModeProps) {
  const [cards, setCards] = useState<SheepCard[]>(() => cloneCards(sheepEasyConfig.cards));
  const [trayIds, setTrayIds] = useState<string[]>([]);
  const [statusText, setStatusText] = useState("只能点击未被遮挡的卡牌，凑齐三个相同卡牌即可消除。");
  const finishedRef = useRef(false);

  useEffect(() => {
    setCards(cloneCards(sheepEasyConfig.cards));
    setTrayIds([]);
    setStatusText("只能点击未被遮挡的卡牌，凑齐三个相同卡牌即可消除。");
    finishedRef.current = false;
  }, [session.runId]);

  useEffect(() => {
    if (finishedRef.current) {
      return;
    }

    if (allCardsCleared(cards)) {
      finishedRef.current = true;
      onFinish({
        status: "win",
        title: "羊了个羊胜利",
        description: `你成功清空了所有卡牌，剩余槽位 ${sheepEasyConfig.slotLimit - trayIds.length}。`,
      });
      return;
    }

    if (trayIds.length >= sheepEasyConfig.slotLimit) {
      finishedRef.current = true;
      onFinish({
        status: "lose",
        title: "羊了个羊失败",
        description: "槽位已满，且没有及时凑成三个相同卡牌。",
      });
    }
  }, [cards, onFinish, trayIds.length]);

  function handleCardClick(cardId: string) {
    if (finishedRef.current) {
      return;
    }

    if (isCardBlocked(cards, cardId)) {
      setStatusText("这张卡牌还被上层遮挡，暂时不能点击。");
      return;
    }

    const nextCards = cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            status: "tray" as const,
          }
        : card,
    );

    const nextTrayIds = [...trayIds, cardId];
    const resolved = removeTrayTriples(nextCards, nextTrayIds);

    setCards(resolved.cards);
    setTrayIds(resolved.trayIds);

    if (resolved.clearedCount > 0) {
      setStatusText(`成功消除了 ${resolved.clearedKinds.join(" / ")} 组合。`);
      return;
    }

    setStatusText(`卡牌已进入槽位，当前已占用 ${resolved.trayIds.length} / ${sheepEasyConfig.slotLimit}。`);
  }

  const boardCards = cards.filter((card) => card.status === "board");
  const trayCards = trayIds
    .map((id) => cards.find((card) => card.id === id))
    .filter((card): card is SheepCard => Boolean(card));

  return (
    <section className="mode-shell">
      <header className="mode-header">
        <div>
          <p className="mode-kicker">卡牌 / 简单</p>
          <h2>羊了个羊 - 简单模式</h2>
        </div>
        <div className="mode-badge-group">
          <span>运行编号 #{session.runId}</span>
          <span>槽位上限 {sheepEasyConfig.slotLimit}</span>
          <span>剩余卡牌 {boardCards.length}</span>
        </div>
      </header>

      <div className="mode-grid">
        <article className="mode-card">
          <h3>本阶段已接入</h3>
          <ul className="mode-list">
            <li>卡牌层级布局</li>
            <li>遮挡判定</li>
            <li>点击入槽</li>
            <li>三张相同卡牌自动消除</li>
            <li>槽位满失败 / 全清胜利</li>
          </ul>
        </article>
        <article className="mode-card">
          <h3>当前规则</h3>
          <ul className="mode-list">
            <li>只能点击未被遮挡的卡牌</li>
            <li>卡牌点击后进入下方槽位</li>
            <li>槽位中凑齐三个相同卡牌会自动消除</li>
            <li>槽位达到上限即失败</li>
          </ul>
        </article>
      </div>

      <div className="match3-status-panel">
        <div className="status-strip">
          <span>剩余卡牌 {boardCards.length}</span>
          <span className="status-pill-strong">
            槽位 {trayCards.length} / {sheepEasyConfig.slotLimit}
          </span>
        </div>
        <p className="match3-hint">{statusText}</p>
      </div>

      <div className="sheep-board">
        {boardCards.map((card) => {
          const blocked = isCardBlocked(cards, card.id);

          return (
            <button
              key={card.id}
              aria-label={`sheep-card-${card.id}-${card.kind}`}
              className={`sheep-card sheep-${card.kind}${blocked ? " sheep-card-blocked" : " sheep-card-open"}`}
              onClick={() => handleCardClick(card.id)}
              style={{
                left: `${card.x * 72}px`,
                top: `${card.y * 92}px`,
                zIndex: card.layer * 10 + Math.round(card.x),
              }}
              type="button"
            >
              <span className="sheep-card-label">{kindLabels[card.kind]}</span>
            </button>
          );
        })}
      </div>

      <div className="sheep-tray">
        {Array.from({ length: sheepEasyConfig.slotLimit }, (_, index) => {
          const card = trayCards[index];

          return (
            <div key={`tray-slot-${index}`} className="sheep-tray-slot">
              {card ? (
                <div className={`sheep-tray-card sheep-${card.kind}`}>
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
