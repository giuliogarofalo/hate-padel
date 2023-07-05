export interface Team {
  name: string;
  score: number;
  experience: number;
}

export interface Game {
  team1: Team;
  team2: Team;
  score: [number, Point];
}

export interface MatchSet {
  games: Game[];
  winner?: Team;
}

export interface Match {
  numberOfSets: number;
  sets: MatchSet[];
  winner?: Team;

}

export enum Point {
  Love,
  Fifteen,
  Thirty,
  Forty,
}