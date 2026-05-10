import { CoinCounter } from "@/components/CoinCounter";
import { PageFrame } from "@/components/PageFrame";
import { allTileKinds, tileVisuals } from "@/games/match3/match3Assets";
import {
  characterDescriptions,
  characterFavoriteFoods,
  FRAGMENTS_PER_CHARACTER,
  getFoodPreferenceLabel,
} from "@/shared/config/collectionRules";
import { foodVisuals } from "@/shared/config/foodAssets";
import type { TileKind } from "@/games/match3/match3Types";
import type {
  AffectionStats,
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
  foods: FoodInventory;
  onStart: () => void;
  onNewGame: () => void;
  onBuyFood: (foodType: FoodType) => void;
  onFeedCharacter: (kind: TileKind, foodType: FoodType) => void;
};

export function HomePage({
  coins,
  fragments,
  collectedCharacters,
  affection,
  foods,
  onStart,
  onNewGame,
  onBuyFood,
  onFeedCharacter,
}: HomePageProps) {
  const unlockedKinds = allTileKinds.filter((kind) => collectedCharacters[kind] > 0);

  return (
    <PageFrame
      eyebrow="P1 首页与养成"
      title="消除大师"
      description="当前版本已接入角色碎片收集、角色兑换、商店购买和喂食养成。挑战成功后才会获得金币与碎片奖励。"
      hero
    >
      <div className="status-strip">
        <CoinCounter emphasize value={coins} />
      </div>

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
          <h2>工具消耗升级</h2>
          <p>提示和洗牌现在都需要消耗 5 金币，更强调商店、奖励和养成的资源循环。</p>
        </article>
      </div>

      <section className="collection-panel">
        <h2 className="section-title">已兑换角色</h2>
        <div className="collection-grid">
          {unlockedKinds.length > 0 ? (
            unlockedKinds.map((kind) => (
              <article className="collection-card collection-card-unlocked" key={`owned-${kind}`}>
                <img
                  alt={tileVisuals[kind].label}
                  className="collection-avatar"
                  draggable={false}
                  src={tileVisuals[kind].image}
                />
                <strong>{tileVisuals[kind].label}</strong>
                <span>已兑换：{collectedCharacters[kind]}</span>
                <span>好感度：{affection[kind]}</span>
              </article>
            ))
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

            return (
              <article
                className={`collection-card character-card${unlocked ? "" : " collection-card-locked"}`}
                key={kind}
              >
                <img
                  alt={tileVisuals[kind].label}
                  className="collection-avatar"
                  draggable={false}
                  src={tileVisuals[kind].image}
                />
                <strong>{tileVisuals[kind].label}</strong>
                <span>碎片：{fragments[kind]} / {FRAGMENTS_PER_CHARACTER}</span>
                <span>已兑换：{collectedCharacters[kind]}</span>
                <span>好感度：{affection[kind]}</span>
                <span>偏好食物：{getFoodPreferenceLabel(characterFavoriteFoods[kind])}</span>
                <p className="character-description">{characterDescriptions[kind]}</p>
                <div className="feed-actions">
                  {Object.entries(foodVisuals).map(([foodType, food]) => (
                    <button
                      className="ghost-button"
                      disabled={!unlocked || foods[foodType as FoodType] <= 0}
                      key={`${kind}-${foodType}`}
                      onClick={() => onFeedCharacter(kind as TileKind, foodType as FoodType)}
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
    </PageFrame>
  );
}
