import { useMemo, useState } from "react";
import { CoinCounter } from "@/components/CoinCounter";
import { PageFrame } from "@/components/PageFrame";
import { allTileKinds, tileVisuals } from "@/games/match3/match3Assets";
import {
  BREAKTHROUGH_AFFECTION,
  characterDescriptions,
  characterFavoriteFoods,
  getAffectionGain,
  getFoodPreferenceLabel,
} from "@/shared/config/collectionRules";
import { foodVisuals } from "@/shared/config/foodAssets";
import type { TileKind } from "@/games/match3/match3Types";
import type {
  AffectionStats,
  CharacterBreakthrough,
  CharacterCollection,
  FoodInventory,
  FoodType,
  FragmentInventory,
} from "@/shared/types/app";

type HomePageProps = {
  coins: number;
  fragments: FragmentInventory;
  collectedCharacters: CharacterCollection;
  affection: AffectionStats;
  breakthroughs: CharacterBreakthrough;
  foods: FoodInventory;
  onStart: () => void;
  onNewGame: () => void;
  onBuyFood: (foodType: FoodType) => void;
  onFeedCharacter: (kind: TileKind, foodType: FoodType) => void;
  onBreakthrough: (kind: TileKind) => void;
};

function getAffectionText(value: number): string {
  return value >= BREAKTHROUGH_AFFECTION ? "好感度已满" : `好感度：${value} / ${BREAKTHROUGH_AFFECTION}`;
}

export function HomePage({
  coins,
  fragments,
  collectedCharacters,
  affection,
  breakthroughs,
  foods,
  onStart,
  onNewGame,
  onBuyFood,
  onFeedCharacter,
  onBreakthrough,
}: HomePageProps) {
  const [feedMessage, setFeedMessage] = useState<string | null>(null);
  const [breakthroughTarget, setBreakthroughTarget] = useState<TileKind | null>(null);
  const [animatedKind, setAnimatedKind] = useState<TileKind | null>(null);
  const unlockedKinds = allTileKinds.filter((kind) => collectedCharacters[kind] > 0);

  const breakthroughCandidates = useMemo(
    () =>
      unlockedKinds.filter(
        (kind) => affection[kind] >= BREAKTHROUGH_AFFECTION && !breakthroughs[kind],
      ),
    [affection, breakthroughs, unlockedKinds],
  );

  function handleFeed(kind: TileKind, foodType: FoodType) {
    const gain = getAffectionGain(kind, foodType);
    onFeedCharacter(kind, foodType);
    setFeedMessage(`${tileVisuals[kind].label} 吃下${foodVisuals[foodType].label}，好感度 +${gain}`);

    window.setTimeout(() => {
      setFeedMessage(null);
    }, 1800);
  }

  function handleBreakthroughConfirm() {
    if (!breakthroughTarget) {
      return;
    }

    onBreakthrough(breakthroughTarget);
    setAnimatedKind(breakthroughTarget);
    setFeedMessage(`${tileVisuals[breakthroughTarget].label} 完成突破，已解锁新形态。`);
    setBreakthroughTarget(null);

    window.setTimeout(() => {
      setAnimatedKind(null);
      setFeedMessage(null);
    }, 2200);
  }

  return (
    <PageFrame
      eyebrow="Cozy Collection"
      title="角落消消"
      description="把碎片、金币、零食和好感度慢慢攒起来，让每个小角色都在你的角落里安稳住下。"
      hero
    >
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-hero-badge">治愈收集 / 三消养成</span>
          <h2 className="home-subtitle">今天也陪它们慢慢长大</h2>
          <p className="home-subtext">
            挑战成功后领取金币与碎片奖励，喂它们喜欢的零食，攒满好感度，再一起迎来突破时刻。
          </p>
          <div className="button-row home-hero-actions">
            <button className="primary-button" onClick={onStart} type="button">
              开始游戏
            </button>
            <button className="secondary-button" onClick={onNewGame} type="button">
              开新游戏
            </button>
          </div>
        </div>

        <div className="home-hero-card">
          <div className="status-strip home-status-strip">
            <CoinCounter emphasize value={coins} />
            <span>已解锁角色：{unlockedKinds.length}</span>
            <span>零食种类：3</span>
          </div>
          <div className="home-hero-gallery">
            {allTileKinds.slice(0, 4).map((kind) => (
              <div className="home-hero-portrait" key={`hero-${kind}`}>
                <img
                  alt={tileVisuals[kind].label}
                  className="collection-avatar"
                  draggable={false}
                  src={breakthroughs[kind] ? tileVisuals[kind].awakenedImage : tileVisuals[kind].image}
                />
                <span>{tileVisuals[kind].label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {feedMessage ? <p className="feed-toast">{feedMessage}</p> : null}

      {breakthroughCandidates.length > 0 ? (
        <div className="breakthrough-banner">
          <strong>突破提醒</strong>
          <span>已有角色达到 20 好感度，可以突破并切换新立绘。</span>
        </div>
      ) : null}

      <div className="feature-grid">
        <article className="feature-card feature-card-warm">
          <h2>安静的小棋盘</h2>
          <p>9 x 9 棋盘配合 6 类元素，节奏更柔和，适合慢慢收集和反复体验。</p>
        </article>
        <article className="feature-card feature-card-warm">
          <h2>赢了才有礼物</h2>
          <p>只有通关后才会结算金币和碎片奖励，让每次胜利都更像一次认真照顾。</p>
        </article>
        <article className="feature-card feature-card-warm">
          <h2>喂食与突破</h2>
          <p>给它们喜欢的零食会涨得更快，等好感度满了，就能解锁更温暖的新形态。</p>
        </article>
      </div>

      <section className="collection-panel">
        <h2 className="section-title">已兑换角色</h2>
        <div className="collection-grid">
          {unlockedKinds.length > 0 ? (
            unlockedKinds.map((kind) => {
              const visual = breakthroughs[kind]
                ? tileVisuals[kind].awakenedImage
                : tileVisuals[kind].image;

              return (
                <article
                  className={`collection-card collection-card-unlocked collection-card-soft${animatedKind === kind ? " character-awakened" : ""}`}
                  key={`owned-${kind}`}
                >
                  <img
                    alt={tileVisuals[kind].label}
                    className="collection-avatar"
                    draggable={false}
                    src={visual}
                  />
                  <strong>{tileVisuals[kind].label}</strong>
                  <span>已兑换：{collectedCharacters[kind]}</span>
                  <span>{getAffectionText(affection[kind])}</span>
                  <span>{breakthroughs[kind] ? "状态：已突破" : "状态：未突破"}</span>
                </article>
              );
            })
          ) : (
            <article className="collection-card collection-card-empty collection-card-soft">
              <strong>暂未兑换角色</strong>
              <span>先挑战成功，积累碎片后再来把它们接回家。</span>
            </article>
          )}
        </div>
      </section>

      <section className="collection-panel">
        <h2 className="section-title">暖心商店</h2>
        <div className="collection-grid">
          {Object.entries(foodVisuals).map(([foodType, food]) => (
            <article className="collection-card shop-card collection-card-soft" key={foodType}>
              <img
                alt={food.label}
                className="collection-avatar"
                draggable={false}
                src={food.image}
              />
              <strong>{food.label}</strong>
              <span>价格：{food.price} 金币</span>
              <span>库存：{foods[foodType as FoodType]}</span>
              <button
                className="secondary-button"
                disabled={coins < food.price}
                onClick={() => onBuyFood(foodType as FoodType)}
                type="button"
              >
                购买
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="collection-panel">
        <h2 className="section-title">角色图鉴</h2>
        <p className="collection-rule-note">
          碎片按累计计算：每消除 1 个元素，就增加 1 个对应碎片；累计到 200 可兑换角色，超过 200 后每多 20 个碎片会自动转化为 1 金币。
        </p>
        <div className="collection-grid character-grid">
          {allTileKinds.map((kind) => {
            const unlocked = collectedCharacters[kind] > 0;
            const canBreakthrough =
              unlocked && affection[kind] >= BREAKTHROUGH_AFFECTION && !breakthroughs[kind];
            const visual = breakthroughs[kind]
              ? tileVisuals[kind].awakenedImage
              : tileVisuals[kind].image;

            return (
              <article
                className={`collection-card character-card collection-card-soft${unlocked ? "" : " collection-card-locked"}${animatedKind === kind ? " character-awakened" : ""}`}
                key={kind}
              >
                <img
                  alt={tileVisuals[kind].label}
                  className="collection-avatar"
                  draggable={false}
                  src={visual}
                />
                <strong>{tileVisuals[kind].label}</strong>
                <span>累计碎片：{fragments[kind]}</span>
                <span>已兑换：{collectedCharacters[kind]}</span>
                <span>{getAffectionText(affection[kind])}</span>
                <span>偏好食物：{getFoodPreferenceLabel(characterFavoriteFoods[kind])}</span>
                <span>{breakthroughs[kind] ? "形态：突破立绘" : "形态：基础立绘"}</span>
                <p className="character-description">{characterDescriptions[kind]}</p>

                {canBreakthrough ? (
                  <button
                    className="primary-button breakthrough-button"
                    onClick={() => setBreakthroughTarget(kind)}
                    type="button"
                  >
                    突破
                  </button>
                ) : null}

                <div className="feed-actions">
                  {Object.entries(foodVisuals).map(([foodType, food]) => (
                    <button
                      className="ghost-button"
                      disabled={!unlocked || foods[foodType as FoodType] <= 0}
                      key={`${kind}-${foodType}`}
                      onClick={() => handleFeed(kind, foodType as FoodType)}
                      type="button"
                    >
                      喂{food.label}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {breakthroughTarget ? (
        <div className="breakthrough-modal-backdrop" role="presentation">
          <div className="breakthrough-modal" role="dialog" aria-modal="true">
            <img
              alt={tileVisuals[breakthroughTarget].label}
              className="breakthrough-modal-image"
              draggable={false}
              src={tileVisuals[breakthroughTarget].awakenedImage}
            />
            <strong>{tileVisuals[breakthroughTarget].label} 已达到突破条件</strong>
            <p>当前好感度达到 20，是否立即突破并切换到新立绘？</p>
            <div className="button-row">
              <button className="primary-button" onClick={handleBreakthroughConfirm} type="button">
                立即突破
              </button>
              <button
                className="ghost-button"
                onClick={() => setBreakthroughTarget(null)}
                type="button"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageFrame>
  );
}
