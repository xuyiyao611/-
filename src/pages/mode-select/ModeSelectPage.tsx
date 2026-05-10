import { PageFrame } from "@/components/PageFrame";
import { gameTypeDescriptions, gameTypeLabels } from "@/shared/config/gameCatalog";
import type { GameType } from "@/shared/types/app";

type ModeSelectPageProps = {
  selectedGameType: GameType | null;
  onBack: () => void;
  onSelect: (gameType: GameType) => void;
};

export function ModeSelectPage({
  selectedGameType,
  onBack,
  onSelect,
}: ModeSelectPageProps) {
  const gameTypes: GameType[] = ["match3", "sheep"];

  return (
    <PageFrame
      eyebrow="P1 页面流转"
      title="选择玩法"
      description="先确定当前要进入哪一种玩法。P1 阶段只负责把主流程组织稳定，真正的玩法逻辑会在后续阶段接入。"
    >
      <div className="selection-grid">
        {gameTypes.map((gameType) => {
          const active = selectedGameType === gameType;

          return (
            <button
              key={gameType}
              className={`selection-card${active ? " selection-card-active" : ""}`}
              onClick={() => onSelect(gameType)}
              type="button"
            >
              <span className="selection-title">{gameTypeLabels[gameType]}</span>
              <span className="selection-text">{gameTypeDescriptions[gameType]}</span>
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
