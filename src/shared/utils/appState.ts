import { allTileKinds } from "@/games/match3/match3Assets";
import {
  FRAGMENTS_PER_CHARACTER,
  foodPrices,
  getAffectionGain,
} from "@/shared/config/collectionRules";
import type {
  AppAction,
  AppState,
  AffectionStats,
  CharacterCollection,
  ClearedElementStats,
  FoodInventory,
  FragmentInventory,
} from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

const INITIAL_COINS = 10;

function createSession(state: AppState): GameSession | null {
  if (!state.gameType || !state.difficulty) {
    return null;
  }

  const previousRunId = state.session?.runId ?? 0;

  return {
    gameType: state.gameType,
    difficulty: state.difficulty,
    startedAt: Date.now(),
    runId: previousRunId + 1,
  };
}

function createEmptyCounter(): ClearedElementStats {
  return {
    sun: 0,
    leaf: 0,
    drop: 0,
    berry: 0,
    star: 0,
    candy: 0,
    sprout: 0,
    puff: 0,
  };
}

function createEmptyFragments(): FragmentInventory {
  return createEmptyCounter();
}

function createEmptyCollection(): CharacterCollection {
  return createEmptyCounter();
}

function createEmptyAffection(): AffectionStats {
  return createEmptyCounter();
}

function createEmptyFoods(): FoodInventory {
  return {
    pudding: 0,
    soda: 0,
    popsicle: 0,
  };
}

function applyFragmentRewards(
  currentFragments: FragmentInventory,
  currentCollection: CharacterCollection,
  gains: ClearedElementStats,
): {
  fragments: FragmentInventory;
  collectedCharacters: CharacterCollection;
} {
  const nextFragments: FragmentInventory = { ...currentFragments };
  const nextCollection: CharacterCollection = { ...currentCollection };

  for (const kind of allTileKinds) {
    const total = nextFragments[kind] + gains[kind];
    const redeemedCount = Math.floor(total / FRAGMENTS_PER_CHARACTER);
    nextFragments[kind] = total % FRAGMENTS_PER_CHARACTER;
    nextCollection[kind] += redeemedCount;
  }

  return {
    fragments: nextFragments,
    collectedCharacters: nextCollection,
  };
}

export function createInitialAppState(): AppState {
  return {
    scene: "home",
    gameType: null,
    difficulty: null,
    result: null,
    session: null,
    coins: INITIAL_COINS,
    fragments: createEmptyFragments(),
    collectedCharacters: createEmptyCollection(),
    affection: createEmptyAffection(),
    foods: createEmptyFoods(),
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "GO_HOME":
      return {
        ...state,
        scene: "home",
        result: null,
        session: null,
        difficulty: null,
      };
    case "RESET_NEW_GAME":
      return createInitialAppState();
    case "OPEN_DIFFICULTY_SELECT":
      return {
        ...state,
        gameType: "match3",
        difficulty: null,
        result: null,
        session: null,
        scene: "difficultySelect",
      };
    case "SELECT_DIFFICULTY": {
      if (!state.gameType) {
        return {
          ...state,
          gameType: "match3",
          scene: "difficultySelect",
        };
      }

      const nextState: AppState = {
        ...state,
        difficulty: action.payload,
        result: null,
        scene: "game",
      };

      return {
        ...nextState,
        session: createSession(nextState),
      };
    }
    case "FINISH_GAME": {
      if (!state.gameType || !state.difficulty || !state.session) {
        return {
          ...state,
          scene: "home",
        };
      }

      const rewardGranted = action.payload.status === "win";
      const fragmentGains = rewardGranted
        ? action.payload.settlement?.fragmentGains ?? createEmptyCounter()
        : createEmptyCounter();
      const collectionResult = rewardGranted
        ? applyFragmentRewards(state.fragments, state.collectedCharacters, fragmentGains)
        : {
            fragments: state.fragments,
            collectedCharacters: state.collectedCharacters,
          };

      return {
        ...state,
        result: action.payload,
        coins: state.coins + (rewardGranted ? action.payload.settlement?.coinReward ?? 0 : 0),
        fragments: collectionResult.fragments,
        collectedCharacters: collectionResult.collectedCharacters,
        scene: "result",
      };
    }
    case "RESTART_GAME":
      if (!state.gameType || !state.difficulty) {
        return createInitialAppState();
      }
      return {
        ...state,
        result: null,
        scene: "game",
        session: createSession(state),
      };
    case "BACK_TO_DIFFICULTY_SELECT":
      return {
        ...state,
        difficulty: null,
        result: null,
        session: null,
        gameType: "match3",
        scene: "difficultySelect",
      };
    case "SPEND_COINS":
      return {
        ...state,
        coins: Math.max(0, state.coins - action.payload),
      };
    case "BUY_FOOD": {
      const price = foodPrices[action.payload];

      if (state.coins < price) {
        return state;
      }

      return {
        ...state,
        coins: state.coins - price,
        foods: {
          ...state.foods,
          [action.payload]: state.foods[action.payload] + 1,
        },
      };
    }
    case "FEED_CHARACTER": {
      const { kind, foodType } = action.payload;

      if (state.collectedCharacters[kind] <= 0 || state.foods[foodType] <= 0) {
        return state;
      }

      return {
        ...state,
        affection: {
          ...state.affection,
          [kind]: state.affection[kind] + getAffectionGain(kind, foodType),
        },
        foods: {
          ...state.foods,
          [foodType]: state.foods[foodType] - 1,
        },
      };
    }
    default:
      return state;
  }
}
