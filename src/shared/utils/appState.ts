import { allTileKinds } from "@/games/match3/match3Assets";
import {
  BREAKTHROUGH_AFFECTION,
  FRAGMENTS_PER_CHARACTER,
  foodPrices,
  getAffectionGain,
} from "@/shared/config/collectionRules";
import type {
  AppAction,
  AppState,
  AffectionStats,
  CharacterBreakthrough,
  CharacterCollection,
  ClearedElementStats,
  FoodInventory,
  FragmentInventory,
} from "@/shared/types/app";
import type { GameSession } from "@/shared/types/session";

const INITIAL_COINS = 10;
const FRAGMENTS_PER_BONUS_COIN = 20;

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

function createEmptyBreakthroughs(): CharacterBreakthrough {
  return {
    sun: false,
    leaf: false,
    drop: false,
    berry: false,
    star: false,
    candy: false,
    sprout: false,
    puff: false,
  };
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
  bonusCoins: number;
} {
  const nextFragments: FragmentInventory = { ...currentFragments };
  const nextCollection: CharacterCollection = { ...currentCollection };
  let bonusCoins = 0;

  for (const kind of allTileKinds) {
    const previousTotal = currentFragments[kind];
    const nextTotal = previousTotal + gains[kind];
    const previousBonusCoins = Math.floor(
      Math.max(previousTotal - FRAGMENTS_PER_CHARACTER, 0) / FRAGMENTS_PER_BONUS_COIN,
    );
    const nextBonusCoins = Math.floor(
      Math.max(nextTotal - FRAGMENTS_PER_CHARACTER, 0) / FRAGMENTS_PER_BONUS_COIN,
    );

    nextFragments[kind] = nextTotal;
    nextCollection[kind] =
      currentCollection[kind] > 0 || nextTotal >= FRAGMENTS_PER_CHARACTER ? 1 : 0;
    bonusCoins += nextBonusCoins - previousBonusCoins;
  }

  return {
    fragments: nextFragments,
    collectedCharacters: nextCollection,
    bonusCoins,
  };
}

export function createInitialAppState(): AppState {
  return {
    scene: "landing",
    gameType: null,
    difficulty: null,
    result: null,
    session: null,
    coins: INITIAL_COINS,
    fragments: createEmptyFragments(),
    collectedCharacters: createEmptyCollection(),
    affection: createEmptyAffection(),
    foods: createEmptyFoods(),
    breakthroughs: createEmptyBreakthroughs(),
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ENTER_HOME":
      return {
        ...state,
        scene: "home",
        result: null,
        session: null,
        difficulty: null,
      };
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
            bonusCoins: 0,
          };

      return {
        ...state,
        result: action.payload,
        coins:
          state.coins +
          (rewardGranted ? action.payload.settlement?.coinReward ?? 0 : 0) +
          collectionResult.bonusCoins,
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
    case "BREAKTHROUGH_CHARACTER": {
      const kind = action.payload;

      if (
        state.collectedCharacters[kind] <= 0 ||
        state.affection[kind] < BREAKTHROUGH_AFFECTION ||
        state.breakthroughs[kind]
      ) {
        return state;
      }

      return {
        ...state,
        breakthroughs: {
          ...state.breakthroughs,
          [kind]: true,
        },
      };
    }
    default:
      return state;
  }
}
