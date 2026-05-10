import { getModeOption } from "@/shared/config/gameModes";
import type { Difficulty, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type Match3ModeStubProps = {
  session: GameSession;
  difficulty: Difficulty;
  onFinish: (payload: ResultPayload) => void;
};

export function Match3ModeStub({ session, difficulty, onFinish }: Match3ModeStubProps) {
  const mode = getModeOption("match3", difficulty);

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
            <li>棋盘数据结构</li>
            <li>相邻交换规则</li>
            <li>三连判定与消除</li>
            <li>掉落与补位</li>
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
              title: "开心消消乐示例胜利",
              description: "P2 阶段已完成玩法参数传递，下一步可直接接入三消核心算法。",
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
              title: "开心消消乐示例失败",
              description: "P2 阶段已验证结果流转，后续将替换为真实胜负判定。",
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
