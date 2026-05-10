import { Match3ModeStub } from "@/games/match3/Match3ModeStub";
import { SheepModeStub } from "@/games/sheep/SheepModeStub";
import type { Difficulty, GameType, ResultPayload } from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

type GameHostProps = {
  session: GameSession;
  gameType: GameType;
  difficulty: Difficulty;
  onFinish: (payload: ResultPayload) => void;
};

export function GameHost({ session, gameType, difficulty, onFinish }: GameHostProps) {
  if (gameType === "match3" && difficulty === "easy") {
    return <Match3ModeStub session={session} difficulty={difficulty} onFinish={onFinish} />;
  }

  if (gameType === "match3") {
    return <Match3ModeStub session={session} difficulty="easy" onFinish={onFinish} />;
  }

  return <SheepModeStub session={session} difficulty={difficulty} onFinish={onFinish} />;
}
