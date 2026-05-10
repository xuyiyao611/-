import { Match3ModeStub } from "@/games/match3/Match3ModeStub";
import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type GameHostProps = {
  session: GameSession;
  gameType: GameType;
  difficulty: Difficulty;
  coins: number;
  onSpendCoins: (amount: number) => void;
  onFinish: (payload: ResultPayload) => void;
};

export function GameHost({
  session,
  gameType,
  difficulty,
  coins,
  onSpendCoins,
  onFinish,
}: GameHostProps) {
  if (gameType === "match3") {
    return (
      <Match3ModeStub
        session={session}
        difficulty={difficulty}
        coins={coins}
        onSpendCoins={onSpendCoins}
        onFinish={onFinish}
      />
    );
  }

  return null;
}
