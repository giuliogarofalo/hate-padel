export enum Point {
  Love = 0,
  Fifteen = 1,
  Thirty = 2,
}

export interface Team {
  name: string;
  score: number;
  experience: number;
}

export interface PadelSet {
  team1Games: number;
  team2Games: number;
  winner: string | undefined;
}

export interface Match {
  sets: PadelSet[];
  numberOfSets: number;
  winner: string | undefined;
}