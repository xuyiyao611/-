import type { TileKind } from "@/games/match3/match3Types";
import type { GameSession } from "@/shared/types/session";

export type GameType = "match3";

export type Difficulty = "easy" | "hard";
export type FoodType = "pudding" | "soda" | "popsicle";

export type SceneKey = "home" | "difficultySelect" | "game" | "result";

export type ResultStatus = "win" | "lose";

export type ClearedElementStats = Record<TileKind, number>;
export type FragmentInventory = Record<TileKind, number>;
export type CharacterCollection = Record<TileKind, number>;
export type AffectionStats = Record<TileKind, number>;
export type FoodInventory = Record<FoodType, number>;

export type RewardSettlement = {
  baseScore: number;
  moveBonusScore: number;
  specialBonusScore: number;
  finalScore: number;
  coinReward: number;
  rewardGranted: boolean;
  remainingMoves: number;
  remainingSpecialTiles: number;
  explodedTileCount: number;
  activatedSpecialCount: number;
  clearedElements: ClearedElementStats;
  fragmentGains: ClearedElementStats;
  selectedTileKinds: TileKind[];
};

export type ResultPayload = {
  status: ResultStatus;
  title: string;
  description: string;
  settlement?: RewardSettlement;
};

export type AppState = {
  scene: SceneKey;
  gameType: GameType | null;
  difficulty: Difficulty | null;
  result: ResultPayload | null;
  session: GameSession | null;
  coins: number;
  fragments: FragmentInventory;
  collectedCharacters: CharacterCollection;
  affection: AffectionStats;
  foods: FoodInventory;
};

export type AppAction =
  | { type: "GO_HOME" }
  | { type: "RESET_NEW_GAME" }
  | { type: "OPEN_DIFFICULTY_SELECT" }
  | { type: "SELECT_DIFFICULTY"; payload: Difficulty }
  | { type: "FINISH_GAME"; payload: ResultPayload }
  | { type: "RESTART_GAME" }
  | { type: "BACK_TO_DIFFICULTY_SELECT" }
  | { type: "SPEND_COINS"; payload: number }
  | { type: "BUY_FOOD"; payload: FoodType }
  | { type: "FEED_CHARACTER"; payload: { kind: TileKind; foodType: FoodType } };
