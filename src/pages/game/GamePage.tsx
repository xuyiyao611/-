import { CoinCounter } from "@/components/CoinCounter";
import { PageFrame } from "@/components/PageFrame";
import { GameHost } from "@/games/GameHost";
import { difficultyLabels, gameTypeLabels } from "@/shared/config/gameCatalog";
import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type GamePageProps = {
  session: GameSession;
  gameType: GameType;
  difficulty: Difficulty;
  coins: number;
  onSpendCoins: (amount: number) => void;
  onBackHome: () => void;
  onBackModeSelect: () => void;
  onFinish: (payload: ResultPayload) => void;
};

export function GamePage({
  session,
  gameType,
  difficulty,
  coins,
  onSpendCoins,
  onBackHome,
  onBackModeSelect,
  onFinish,
}: GamePageProps) {
  const gameLabel = gameTypeLabels[gameType];
  const difficultyLabel = difficultyLabels[difficulty];

  return (
    <PageFrame
      eyebrow="P2 玩法入口"
      title={`${gameLabel} 游戏中`}
      description={`当前已进入 ${gameLabel} / ${difficultyLabel}，这一层负责把全局金币与单局三消玩法接通。`}
    >
      <div className="status-strip">
        <span>玩法：{gameLabel}</span>
        <span>难度：{difficultyLabel}</span>
        <span>运行编号：{session.runId}</span>
        <CoinCounter value={coins} />
      </div>

      <GameHost
        session={session}
        gameType={gameType}
        difficulty={difficulty}
        coins={coins}
        onSpendCoins={onSpendCoins}
        onFinish={onFinish}
      />

      <div className="button-row">
        <button className="ghost-button" onClick={onBackModeSelect} type="button">
          返回难度选择
        </button>
        <button className="ghost-button" onClick={onBackHome} type="button">
          返回首页
        </button>
      </div>
    </PageFrame>
  );
}
