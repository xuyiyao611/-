import { PageFrame } from "@/components/PageFrame";

type HomePageProps = {
  onStart: () => void;
};

export function HomePage({ onStart }: HomePageProps) {
  return (
    <PageFrame
      eyebrow="P1 主流程骨架"
      title="消除大师"
      description="统一入口已经建立。当前阶段重点是把首页、玩法选择、难度选择、游戏容器和结算容器组织成可维护的主流程。"
      hero
    >
      <div className="feature-grid">
        <article className="feature-card">
          <h2>双玩法入口</h2>
          <p>为开心消消乐和羊了个羊预留独立游戏模块，后续可分别接入核心逻辑。</p>
        </article>
        <article className="feature-card">
          <h2>双难度结构</h2>
          <p>简单模式和困难模式会通过统一配置区分，避免复制两套玩法代码。</p>
        </article>
        <article className="feature-card">
          <h2>统一结算流程</h2>
          <p>所有玩法共用一套结果页、重开入口和返回逻辑，便于后续联调。</p>
        </article>
      </div>

      <div className="button-row">
        <button className="primary-button" onClick={onStart} type="button">
          开始规划主流程
        </button>
      </div>
    </PageFrame>
  );
}
