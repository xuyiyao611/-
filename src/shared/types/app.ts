export type GameType = "match3" | "sheep";

export type Difficulty = "easy" | "hard";

export type SceneKey = "home" | "modeSelect" | "difficultySelect" | "game" | "result";

export type ResultStatus = "win" | "lose";

export type ResultPayload = {
  status: ResultStatus;
  title: string;
  description: string;
};
