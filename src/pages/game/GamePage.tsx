import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";

type GamePageProps = {
  gameType: GameType | null;
  difficulty: Difficulty | null;
  onBackHome: () => void;
  onFinish: (payload: ResultPayload) => void;
};

export function GamePage({ gameType, difficulty, onBackHome, onFinish }: GamePageProps) {
  const modeLabel = gameType === "match3" ? "开心消消乐" : "羊了个羊";
  const difficultyLabel = difficulty === "easy" ? "简单模式" : "困难模式";

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">P0 骨架页</p>
        <h2>游戏场景容器</h2>
        <p className="lead">
          当前已选：{modeLabel} / {difficultyLabel}
        </p>
        <p className="hint-text">下一阶段会在这里接入真正的玩法逻辑。</p>
        <div className="button-grid">
          <button
            className="primary-button"
            onClick={() =>
              onFinish({
                status: "win",
                title: "示例胜利",
                description: "P0 阶段仅用于打通基础流程。",
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
                description: "P0 阶段仅用于打通基础流程。",
              })
            }
            type="button"
          >
            模拟失败
          </button>
        </div>
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </section>
    </main>
  );
}
