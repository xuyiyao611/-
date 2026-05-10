import { useMemo, useState } from "react";
import { CoinCounter } from "@/components/CoinCounter";
import { PageFrame } from "@/components/PageFrame";
import { allTileKinds, tileVisuals } from "@/games/match3/match3Assets";
import {
  BREAKTHROUGH_AFFECTION,
  characterDescriptions,
  characterFavoriteFoods,
  FRAGMENTS_PER_CHARACTER,
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
      eyebrow="P1 首页与养成"
      title="消除大师"
      description="当前版本已接入角色碎片收集、角色兑换、商店购买、喂食养成和突破形态。挑战成功后才会获得金币与碎片奖励。"
      hero
    >
      <div className="status-strip">
        <CoinCounter emphasize value={coins} />
      </div>

      {feedMessage ? <p className="feed-toast">{feedMessage}</p> : null}

      {breakthroughCandidates.length > 0 ? (
        <div className="breakthrough-banner">
          <strong>突破提醒</strong>
          <span>已有角色达到 20 好感度，可以突破并切换新立绘。</span>
        </div>
      ) : null}

      <div className="feature-grid">
        <article className="feature-card">
          <h2>9 x 9 棋盘</h2>
          <p>单局棋盘固定为 9 x 9，每局只出现 6 类元素，节奏更集中，方便测试结算与养成闭环。</p>
        </article>
        <article className="feature-card">
          <h2>胜利后发奖励</h2>
          <p>只有挑战成功才会把本局消除记录转成碎片和金币，失败局只保留统计展示。</p>
        </article>
        <article className="feature-card">
          <h2>突破养成</h2>
          <p>角色好感度达到 20 后可以突破，突破后会切换专属新立绘，并播放升级动画。</p>
        </article>
      </div>

      <section className="collection-panel">
        <h2 className="section-title">已兑换角色</h2>
        <div className="collection-grid">
          {unlockedKinds.length > 0 ? (
            unlockedKinds.map((kind) => {
              const visual = breakthroughs[kind] ? tileVisuals[kind].awakenedImage : tileVisuals[kind].image;

              return (
                <article
                  className={`collection-card collection-card-unlocked${animatedKind === kind ? " character-awakened" : ""}`}
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
                  <span>好感度：{affection[kind]}</span>
                  <span>{breakthroughs[kind] ? "状态：已突破" : "状态：未突破"}</span>
                </article>
              );
            })
          ) : (
            <article className="collection-card collection-card-empty">
              <strong>暂未兑换角色</strong>
              <span>先挑战成功，积累碎片后再来兑换。</span>
            </article>
          )}
        </div>
      </section>

      <section className="collection-panel">
        <h2 className="section-title">商店</h2>
        <div className="collection-grid">
          {Object.entries(foodVisuals).map(([foodType, food]) => (
            <article className="collection-card shop-card" key={foodType}>
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
        <h2 className="section-title">角色介绍</h2>
        <div className="collection-grid character-grid">
          {allTileKinds.map((kind) => {
            const unlocked = collectedCharacters[kind] > 0;
            const canBreakthrough =
              unlocked && affection[kind] >= BREAKTHROUGH_AFFECTION && !breakthroughs[kind];
            const visual = breakthroughs[kind] ? tileVisuals[kind].awakenedImage : tileVisuals[kind].image;

            return (
              <article
                className={`collection-card character-card${unlocked ? "" : " collection-card-locked"}${animatedKind === kind ? " character-awakened" : ""}`}
                key={kind}
              >
                <img
                  alt={tileVisuals[kind].label}
                  className="collection-avatar"
                  draggable={false}
                  src={visual}
                />
                <strong>{tileVisuals[kind].label}</strong>
                <span>碎片：{fragments[kind]} / {FRAGMENTS_PER_CHARACTER}</span>
                <span>已兑换：{collectedCharacters[kind]}</span>
                <span>好感度：{affection[kind]} / {BREAKTHROUGH_AFFECTION}</span>
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

      <div className="button-grid">
        <button className="primary-button" onClick={onStart} type="button">
          开始游戏
        </button>
        <button className="secondary-button" onClick={onNewGame} type="button">
          开新游戏
        </button>
      </div>

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
