import { PageFrame } from "@/components/PageFrame";
import { difficultyLabels, gameTypeLabels } from "@/shared/config/gameCatalog";
import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";

type GamePageProps = {
  gameType: GameType;
  difficulty: Difficulty;
  onBackHome: () => void;
  onBackModeSelect: () => void;
  onFinish: (payload: ResultPayload) => void;
};

export function GamePage({
  gameType,
  difficulty,
  onBackHome,
  onBackModeSelect,
  onFinish,
}: GamePageProps) {
  const gameLabel = gameTypeLabels[gameType];
  const difficultyLabel = difficultyLabels[difficulty];

  return (
    <PageFrame
      eyebrow="P1 游戏容器"
      title="游戏场景容器"
      description={`当前已进入 ${gameLabel} / ${difficultyLabel}。P1 阶段先保证场景参数和主流程闭环正确，P3 之后再接入真实玩法。`}
    >
      <div className="status-strip">
        <span>玩法：{gameLabel}</span>
        <span>难度：{difficultyLabel}</span>
        <span>阶段：主流程容器</span>
      </div>

      <div className="placeholder-board">
        <div className="placeholder-column">
          <h2>当前阶段内容</h2>
          <p>这里会在后续阶段替换为真实玩法视图和核心算法驱动的数据界面。</p>
        </div>
        <div className="placeholder-column">
          <h2>下一步接入</h2>
          <p>
            开心消消乐会接入棋盘、交换、消除、掉落逻辑；羊了个羊会接入卡牌层级、槽位和三消逻辑。
          </p>
        </div>
      </div>

      <div className="button-grid">
        <button
          className="primary-button"
          onClick={() =>
            onFinish({
              status: "win",
              title: "示例胜利",
              description: "P1 阶段用于验证游戏容器到结果页的主流程闭环。",
            })
          }
          type="button"
        >
          模拟胜利
        </button>
        <button
          className="secondary-button"
          onClick={() =>
            onFinish({
              status: "lose",
              title: "示例失败",
              description: "P1 阶段用于验证失败结果页和返回流程。",
            })
          }
          type="button"
        >
          模拟失败
        </button>
      </div>

      <div className="button-row">
        <button className="ghost-button" onClick={onBackModeSelect} type="button">
          返回玩法选择
        </button>
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </div>
    </PageFrame>
  );
}
