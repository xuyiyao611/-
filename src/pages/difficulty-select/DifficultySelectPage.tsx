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
      eyebrow="P1 页面流转"
      title={title}
      description="这一层只负责把难度参数准确传给后续游戏页。简单和困难会在后续阶段通过配置驱动实际差异。"
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
          返回玩法选择
        </button>
      </div>
    </PageFrame>
  );
}
