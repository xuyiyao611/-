export type SheepKind = "bun" | "bell" | "leaf" | "gem";

export type SheepCardStatus = "board" | "tray" | "cleared";

export type SheepZoneRole = "core" | "upper" | "wing" | "side";

export type SheepZone = {
  id: string;
  label: string;
  role: SheepZoneRole;
};

export type SheepCardTemplate = {
  id: string;
  pileId: string;
  zoneId: string;
  stackIndex: number;
  kind: SheepKind;
  depth: number;
  x: number;
  y: number;
  tilt: number;
};

export type SheepCard = SheepCardTemplate & {
  blockers: string[];
  status: SheepCardStatus;
};

export type SheepTraySlot = {
  index: number;
  cardId: string | null;
};

export type SheepGameOutcome = "ongoing" | "win" | "lose";

export type SheepMoveFailureReason = "blocked" | "missing" | "unavailable";

export type SheepMoveResult = {
  cards: SheepCard[];
  trayCardIds: string[];
  clearedKinds: SheepKind[];
  clearedCount: number;
  movedCardId: string | null;
  blocked: boolean;
  failureReason: SheepMoveFailureReason | null;
};

export type SheepConfig = {
  slotLimit: number;
  boardWidth: number;
  boardHeight: number;
  cardWidth: number;
  cardHeight: number;
  title: string;
  intro: string;
  zones: SheepZone[];
  cards: SheepCardTemplate[];
};
