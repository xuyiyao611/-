import type { Difficulty, GameType } from "@/shared/types/app";

type DifficultySelectPageProps = {
  gameType: GameType | null;
  onBack: () => void;
  onSelect: (difficulty: Difficulty) => void;
};

export function DifficultySelectPage({
  gameType,
  onBack,
  onSelect,
}: DifficultySelectPageProps) {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">P0 骨架页</p>
        <h2>选择难度</h2>
        <p className="lead">当前玩法：{gameType === "match3" ? "开心消消乐" : "羊了个羊"}</p>
        <div className="button-grid">
          <button className="primary-button" onClick={() => onSelect("easy")} type="button">
            简单模式
          </button>
          <button className="primary-button" onClick={() => onSelect("hard")} type="button">
            困难模式
          </button>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          返回
        </button>
      </section>
    </main>
  );
}
