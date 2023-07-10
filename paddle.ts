import readline from 'readline';

enum Point {
  Love = 0,
  Fifteen = 1,
  Thirty = 2,
  Forty = 3,
}

enum GameState {
  Deuce,
  Advantage,
  GameOver,
}

interface Team {
  name: string;
  score: number;
  experience: number;
}

interface Game {
  team1: Team;
  team2: Team;
  gameState: GameState;
  score: [number, number];
}

interface Set {
  games: Game[];
  winner?: Team;
}

interface Match {
  sets: Set[];
  winner?: Team;
}

class PadelGame {
  private readonly team1: Team;
  private readonly team2: Team;
  private match: Match;

  constructor(team1: Team, team2: Team) {
    this.team1 = team1;
    this.team2 = team2;
    this.match = { sets: [] };
  }

  private getRandomWinner(): Team {
    return Math.random() < 0.5 ? this.team1 : this.team2;
  }

  private getScoreString(score: number): string {
    switch (score) {
      case Point.Love:
        return '0';
      case Point.Fifteen:
        return '15';
      case Point.Thirty:
        return '30';
      case Point.Forty:
        return '40';
      default:
        return '';
    }
  }

  private printGameScore(game: Game): void {
    const { team1, team2, score } = game;
    const scoreString1 = this.getScoreString(score[0]);
    const scoreString2 = this.getScoreString(score[1]);

    console.log(`${team1.name}: ${scoreString1}`);
    console.log(`${team2.name}: ${scoreString2}`);
  }

  private playPoint(game: Game): Game {
    const { score, gameState } = game;

    if (gameState === GameState.GameOver) {
      return game;
    }

    const [score1, score2] = score;
    const winningTeam = this.getRandomWinner();
    console.log(`${winningTeam.name} wins the point!`);
    const experienceDifference = this.team1.experience - this.team2.experience;
    const winProbability = (experienceDifference + 100) / 200; // Adjusted win probability based on experience

    if (winningTeam === this.team1) {

      if (gameState === GameState.Advantage) {
        return { ...game, score: [score1 + 1, score2], gameState: GameState.GameOver };
      } else if (Math.random() < winProbability) {
        if (score1 === Point.Forty) {
          return { ...game, score: [score1 + 1, score2], gameState: GameState.Advantage };
        } else if (score1 < Point.Forty) {
          return { ...game, score: [score1 + 1, score2], gameState };
        }
      }
    } 
    if (winningTeam === this.team2) {
     
      if (gameState === GameState.Advantage) {
        return { 
          ...game, 
          score: [score1, score2 + 1], 
          gameState: GameState.GameOver 
        };
      
      } else if (Math.random() < (1 - winProbability)) {
        if (score2 === Point.Forty) {

          return { 
            ...game, 
            score: [score1, score2 + 1], 
            gameState: GameState.Advantage 
          };

        } else if (score2 < Point.Forty) {
          return { ...game, score: [score1, score2 + 1], gameState };
        }
      }
    }

    return { ...game };
  }

  private isSetFinished(set: Set): boolean {
    // These variables are initialized with the total scores of team 1 and team 2 within the set object. 
    // The reduce function is applied to the games array within the set object, accumulating the scores of team 1 and team 2 in total1 and total2, respectively. Initially, the total values are set to 0.
    const [games1, games2] = set.games.reduce(
      ([total1, total2], game) => [total1 + game.score[0], total2 + game.score[1]],
      [0, 0]
    );
    console.log(`Games: ${games1} - ${games2}`);
    // The difference in games between the teams is calculated using the Math.abs() function. This returns the absolute value of the difference between games1 and games2. This value represents the score difference between the teams.
    const gameDifference = Math.abs(games1 - games2);
    
    // The sum of games for team 1 (games1) is greater than or equal to 6 OR the sum of games for team 2 (games2) is greater than or equal to 6. This indicates that one of the teams has reached at least 6 games.
    const isTieBreak = games1 === 6 && games2 === 6;
    return isTieBreak;
  }

  private playSet(set: Set): void {
    const games: Game[] = [];
    // let gameState: GameState = GameState.Deuce;
    let game: Game = {
      team1: this.team1, team2: this.team2, score: [Point.Love, Point.Love],
      gameState: GameState.Deuce
    };

    while (!this.isSetFinished(set)) {
      game = this.playPoint(game);
      this.printGameScore(game);

      if (game.gameState === GameState.GameOver) {
        games.push(game);

        if (game.score[0] > game.score[1]) {
          set.winner = this.team1;
        } else {
          set.winner = this.team2;
        }

        console.log(`Game score: ${this.team1.name}: ${game.score[0]} | ${this.team2.name}: ${game.score[1]}\n`);
        break;
      }
    }

    set.games = games;
  }

  private playMatch(): void {
    for (let i = 0; i < 3; i++) {
      console.log(`Set ${i + 1}:`);
      const set: Set = { games: [] };
      this.playSet(set);
      this.match.sets.push(set);
    }

    const [sets1, sets2] = this.match.sets.reduce(
      ([total1, total2], set) => {
        if (set.winner === this.team1) {
          return [total1 + 1, total2];
        } else {
          return [total1, total2 + 1];
        }
      },
      [0, 0]
    );

    if (sets1 > sets2) {
      this.match.winner = this.team1;
    } else {
      this.match.winner = this.team2;
    }

    console.log(`\n${this.match.winner.name} wins the match!`);
  }

  public startGame(): void {
    console.log('--- Welcome to the Padel Game ---');
    console.log(`Teams: ${this.team1.name} vs ${this.team2.name}\n`);

    this.playMatch();
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the name of Team 1: ', (team1Name) => {
  rl.question('Enter the name of Team 2: ', (team2Name) => {
    rl.question('Enter the experience level of Team 1 (0-100): ', (team1Experience) => {
      rl.question('Enter the experience level of Team 2 (0-100): ', (team2Experience) => {
        rl.close();

        const team1: Team = {
          name: team1Name,
          score: 0,
          experience: parseInt(team1Experience, 10),
        };

        const team2: Team = {
          name: team2Name,
          score: 0,
          experience: parseInt(team2Experience, 10),
        };

        const game = new PadelGame(team1, team2);
        game.startGame();
      });
    });
  });
});