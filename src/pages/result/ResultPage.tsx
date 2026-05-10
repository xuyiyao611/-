import { CoinCounter } from "@/components/CoinCounter";
import { PageFrame } from "@/components/PageFrame";
import { tileVisuals } from "@/games/match3/match3Assets";
import { FRAGMENTS_PER_CHARACTER } from "@/shared/config/collectionRules";
import type {
  CharacterCollection,
  FragmentInventory,
  ResultPayload,
} from "@/shared/types/app";

type ResultPageProps = {
  coins: number;
  fragments: FragmentInventory;
  collectedCharacters: CharacterCollection;
  result: ResultPayload;
  summary: string;
  onRestart: () => void;
  onBackHome: () => void;
  onBackModeSelect: () => void;
};

export function ResultPage({
  coins,
  fragments,
  collectedCharacters,
  result,
  summary,
  onRestart,
  onBackHome,
  onBackModeSelect,
}: ResultPageProps) {
  return (
    <PageFrame eyebrow="P1 结果容器" title={result.title} description={result.description}>
      <div className={`result-banner${result.status === "win" ? " result-win" : " result-lose"}`}>
        <strong>{result.status === "win" ? "结果：胜利" : "结果：失败"}</strong>
        <span>{summary}</span>
        <CoinCounter value={coins} />
      </div>

      {result.settlement ? (
        <section className="reward-panel">
          <div className="reward-hero">
            <p className="reward-kicker">
              {result.settlement.rewardGranted ? "本局奖励" : "本局统计"}
            </p>
            <div className="reward-coin-card">
              <span className="reward-coin-label">
                {result.settlement.rewardGranted ? "金币奖励" : "奖励状态"}
              </span>
              <strong className="reward-coin-value">
                {result.settlement.rewardGranted ? `+${result.settlement.coinReward}` : "挑战失败"}
              </strong>
            </div>
            <div className="reward-score-card">
              <span className="reward-score-label">最终总分</span>
              <strong className="reward-score-value">{result.settlement.finalScore}</strong>
            </div>
          </div>

          {!result.settlement.rewardGranted ? (
            <p className="reward-note">本局未通关，因此不会发放金币和碎片奖励。</p>
          ) : (
            <p className="reward-note">角色兑换后，多出的碎片会按每 20 个自动转化为 1 金币。</p>
          )}

          <div className="reward-breakdown">
            <article className="reward-line-item">
              <span>基础分数</span>
              <strong>{result.settlement.baseScore}</strong>
            </article>
            <article className="reward-line-item">
              <span>剩余步数奖励</span>
              <strong>{result.settlement.moveBonusScore}</strong>
            </article>
            <article className="reward-line-item">
              <span>特殊结算加分</span>
              <strong>{result.settlement.specialBonusScore}</strong>
            </article>
            <article className="reward-line-item">
              <span>剩余特殊元素</span>
              <strong>{result.settlement.remainingSpecialTiles}</strong>
            </article>
            <article className="reward-line-item">
              <span>累计清除格数</span>
              <strong>{result.settlement.explodedTileCount}</strong>
            </article>
            <article className="reward-line-item">
              <span>触发特殊元素次数</span>
              <strong>{result.settlement.activatedSpecialCount}</strong>
            </article>
          </div>

          <section className="collection-panel">
            <h2 className="section-title">本局消除与碎片</h2>
            <div className="collection-grid">
              {result.settlement.selectedTileKinds.map((kind) => (
                <article className="collection-card" key={kind}>
                  <img
                    alt={tileVisuals[kind].label}
                    className="collection-avatar"
                    draggable={false}
                    src={tileVisuals[kind].image}
                  />
                  <strong>{tileVisuals[kind].label}</strong>
                  <span>本局消除：{result.settlement.clearedElements[kind]}</span>
                  <span>
                    碎片获得：
                    {result.settlement.rewardGranted ? `+${result.settlement.fragmentGains[kind]}` : "0"}
                  </span>
                  <span>当前碎片：{fragments[kind]} / {FRAGMENTS_PER_CHARACTER}</span>
                  <span>已兑换：{collectedCharacters[kind]}</span>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      <div className="button-grid">
        <button className="primary-button" onClick={onRestart} type="button">
          重新开始当前模式
        </button>
        <button className="secondary-button" onClick={onBackModeSelect} type="button">
          返回难度选择
        </button>
      </div>

      <div className="button-row">
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </div>
    </PageFrame>
  );
}
