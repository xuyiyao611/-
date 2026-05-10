import type { GameType } from "@/shared/types/app";

type ModeSelectPageProps = {
  onBack: () => void;
  onSelect: (gameType: GameType) => void;
};

export function ModeSelectPage({ onBack, onSelect }: ModeSelectPageProps) {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">P0 骨架页</p>
        <h2>选择玩法</h2>
        <div className="button-grid">
          <button className="primary-button" onClick={() => onSelect("match3")} type="button">
            开心消消乐
          </button>
          <button className="primary-button" onClick={() => onSelect("sheep")} type="button">
            羊了个羊
          </button>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          返回
        </button>
      </section>
    </main>
  );
}
