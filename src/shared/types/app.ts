import type { GameSession } from "@/shared/types/session";

export type GameType = "match3" | "sheep";

export type Difficulty = "easy" | "hard";

export type SceneKey = "home" | "modeSelect" | "difficultySelect" | "game" | "result";

export type ResultStatus = "win" | "lose";

export type ResultPayload = {
  status: ResultStatus;
  title: string;
  description: string;
};

export type AppState = {
  scene: SceneKey;
  gameType: GameType | null;
  difficulty: Difficulty | null;
  result: ResultPayload | null;
  session: GameSession | null;
};

export type AppAction =
  | { type: "GO_HOME" }
  | { type: "OPEN_MODE_SELECT" }
  | { type: "SELECT_GAME_TYPE"; payload: GameType }
  | { type: "SELECT_DIFFICULTY"; payload: Difficulty }
  | { type: "FINISH_GAME"; payload: ResultPayload }
  | { type: "RESTART_GAME" }
  | { type: "BACK_TO_MODE_SELECT" }
  | { type: "BACK_TO_DIFFICULTY_SELECT" };
