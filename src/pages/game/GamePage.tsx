import { PageFrame } from "@/components/PageFrame";
import { GameHost } from "@/games/GameHost";
import { difficultyLabels, gameTypeLabels } from "@/shared/config/gameCatalog";
import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type GamePageProps = {
  session: GameSession;
  gameType: GameType;
  difficulty: Difficulty;
  onBackHome: () => void;
  onBackModeSelect: () => void;
  onFinish: (payload: ResultPayload) => void;
};

export function GamePage({
  session,
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
      eyebrow="P2 玩法入口接入"
      title="游戏场景容器"
      description={`当前已进入 ${gameLabel} / ${difficultyLabel}。本阶段重点是把玩法与难度参数正式接入游戏宿主组件，为后续真实算法预留稳定入口。`}
    >
      <div className="status-strip">
        <span>玩法：{gameLabel}</span>
        <span>难度：{difficultyLabel}</span>
        <span>运行编号：#{session.runId}</span>
      </div>

      <GameHost
        session={session}
        gameType={gameType}
        difficulty={difficulty}
        onFinish={onFinish}
      />

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
