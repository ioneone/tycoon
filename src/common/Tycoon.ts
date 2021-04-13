import { CardSuit, CardValue } from "./Card";

export enum TycoonOptionKey {
  Revolution = "revolution",
  EightStop = "eight stop",
  Sequence = "sequence",
  Tight = "tight",
  ThreeSpadesReversal = "three spades reversal",
  ThreeClubsStart = "three clubs start",
  ElevenBack = "eleven back",
}

export enum TycoonStateKey {
  Revolution = "revolution",
  ElevenBack = "eleven back",
  Tight = "tight",
  Sequence = "sequence",
}

export interface TycoonOptions {
  [TycoonOptionKey.Revolution]: boolean;
  [TycoonOptionKey.EightStop]: boolean;
  [TycoonOptionKey.Sequence]: boolean;
  [TycoonOptionKey.Tight]: boolean;
  [TycoonOptionKey.ThreeSpadesReversal]: boolean;
  [TycoonOptionKey.ThreeClubsStart]: boolean;
  [TycoonOptionKey.ElevenBack]: boolean;
}

export const DEFAULT_TYCOON_OPTIONS: TycoonOptions = {
  [TycoonOptionKey.Revolution]: false,
  [TycoonOptionKey.EightStop]: false,
  [TycoonOptionKey.Sequence]: false,
  [TycoonOptionKey.Tight]: false,
  [TycoonOptionKey.ThreeSpadesReversal]: false,
  [TycoonOptionKey.ThreeClubsStart]: false,
  [TycoonOptionKey.ElevenBack]: false,
};

export interface TycoonState {
  [TycoonStateKey.Revolution]: boolean;
  [TycoonStateKey.ElevenBack]: boolean;
  [TycoonStateKey.Sequence]: CardValue;
  [TycoonStateKey.Tight]: CardSuit[];
}