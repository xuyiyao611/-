import { getModeOption } from "@/shared/config/gameModes";
import type { Difficulty, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type SheepModeStubProps = {
  session: GameSession;
  difficulty: Difficulty;
  onFinish: (payload: ResultPayload) => void;
};

export function SheepModeStub({ session, difficulty, onFinish }: SheepModeStubProps) {
  const mode = getModeOption("sheep", difficulty);

  return (
    <section className="mode-shell">
      <header className="mode-header">
        <div>
          <p className="mode-kicker">{mode.shortLabel}</p>
          <h2>{mode.title}</h2>
        </div>
        <div className="mode-badge-group">
          <span>运行编号 #{session.runId}</span>
          <span>开始时间 {new Date(session.startedAt).toLocaleTimeString("zh-CN")}</span>
        </div>
      </header>

      <div className="mode-grid">
        <article className="mode-card">
          <h3>阶段目标</h3>
          <p>{mode.goal}</p>
        </article>
        <article className="mode-card">
          <h3>后续玩法接入点</h3>
          <ul className="mode-list">
            <li>更深层级布局</li>
            <li>更多干扰牌</li>
            <li>更复杂容错设计</li>
            <li>困难模式压迫感优化</li>
          </ul>
        </article>
      </div>

      <div className="mode-card">
        <h3>当前模式特征</h3>
        <ul className="mode-list">
          {mode.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="button-grid">
        <button
          className="primary-button"
          onClick={() =>
            onFinish({
              status: "win",
              title: "羊了个羊示例胜利",
              description: "当前困难模式仍为占位结构，P6 会接入真实高压卡牌逻辑。",
            })
          }
          type="button"
        >
          模拟完成本局
        </button>
        <button
          className="secondary-button"
          onClick={() =>
            onFinish({
              status: "lose",
              title: "羊了个羊示例失败",
              description: "当前困难模式仍为占位结构，P6 会替换为真实槽位失败判定。",
            })
          }
          type="button"
        >
          模拟失败本局
        </button>
      </div>
    </section>
  );
}
