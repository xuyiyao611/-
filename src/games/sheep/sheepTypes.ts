export type SheepKind = "bun" | "bell" | "leaf" | "gem";

export type SheepCardStatus = "board" | "tray" | "cleared";

export type SheepCard = {
  id: string;
  kind: SheepKind;
  layer: number;
  x: number;
  y: number;
  coveredBy: string[];
  status: SheepCardStatus;
};

export type SheepConfig = {
  slotLimit: number;
  cards: SheepCard[];
};
