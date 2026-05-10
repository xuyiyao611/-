import { PageFrame } from "@/components/PageFrame";
import {
  difficultyDescriptions,
  difficultyLabels,
  gameTypeLabels,
} from "@/shared/config/gameCatalog";
import type { Difficulty, GameType } from "@/shared/types/app";

type DifficultySelectPageProps = {
  gameType: GameType | null;
  selectedDifficulty: Difficulty | null;
  onBack: () => void;
  onSelect: (difficulty: Difficulty) => void;
};

export function DifficultySelectPage({
  gameType,
  selectedDifficulty,
  onBack,
  onSelect,
}: DifficultySelectPageProps) {
  const difficulties: Difficulty[] = ["easy", "hard"];
  const title = gameType ? `为 ${gameTypeLabels[gameType]} 选择难度` : "选择难度";

  return (
    <PageFrame
      eyebrow="P1 难度选择"
      title={title}
      description="难度会切换目标分数、步数限制和本局刷新元素，棋盘统一为 9 x 9。"
    >
      <div className="selection-grid">
        {difficulties.map((difficulty) => {
          const active = selectedDifficulty === difficulty;

          return (
            <button
              key={difficulty}
              className={`selection-card${active ? " selection-card-active" : ""}`}
              onClick={() => onSelect(difficulty)}
              type="button"
            >
              <span className="selection-title">{difficultyLabels[difficulty]}</span>
              <span className="selection-text">{difficultyDescriptions[difficulty]}</span>
            </button>
          );
        })}
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={onBack} type="button">
          返回首页
        </button>
      </div>
    </PageFrame>
  );
}
