import readline from 'readline';

enum Point {
  Love = 0,
  Fifteen = 1,
  Thirty = 2,
  Forty = 3,
}

enum GameState {
  Deuce,
  None,
  GameOver,
}

interface Team {
  name: string;
  score: number;
  experience: number;
  advantage: 0 | 1 | 2;
}

interface Game {
  team1: Team;
  team2: Team;
  score: [number, number];
}

interface Set {
  games: Game[];
  winner?: Team;
}

interface Match {
  sets: Set[];
  winner?: Team;
  numberOfSets: number;
}

class PadelGame {
  private readonly team1: Team;
  private readonly team2: Team;
  private match: Match;

  constructor(team1: Team, team2: Team, match: Match) {
    this.team1 = team1;
    this.team2 = team2;
    this.match = match;
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

    console.log(`Temporary Score:$ ${this.team1.name} has ${scoreString1} - ${this.team2.name} has ${scoreString2}`)

    console.log(`${team1.name}: ${scoreString1}`);
    console.log(`${team2.name}: ${scoreString2}`);
  }

  private playGame(game: Game): Game {
    const { score } = game;

    const [score1, score2] = score;
    
    console.log(`Temporary Score:$ ${this.team1.name} has ${Point[score1]} - ${this.team2.name} has ${Point[score2]}`)
    console.log("");
    
    const winningTeam = this.getRandomWinner();
    console.log(`${winningTeam.name} wins this game!`);
    console.log("");

    const experienceDifference = this.team1.experience - this.team2.experience;
    const winProbability = (experienceDifference + 100) / 200; // Adjusted win probability based on experience


    if (score1 === Point.Forty && score2 === Point.Forty) {
      console.log("Deuce!");
      return { 
        ...game, 
        score: [score1, score2], 
      };

       
        //   when score1 === Point.Forty && score2 === Point.Forty
        // every next point will be counted as advantagePoint (0: default, 1, 1) and displayed in log
        // if a team wins two consecutive advantagePoints, he wins the game
        // if a team wins one advantagePoint, will be logged "Advantage! ${winningTeam}" 
        // if a team loses one advantagePoint, will be logged "Deuce!" and if team1's advantagePoint are 0 and team2's advantagePoint are 0, log will be "Deuce!" and the game will continue
        
        // when score1 === Point.Forty && score2 === Point.Forty
        // if a team loses one advantagePoint, the other team wins

    }

  }


  private playSet(set: Set): void {
    const games: Game[] = [];
    let game: Game = {
      team1: this.team1, 
      team2: this.team2, 
      score: [Point.Love, Point.Love],
    };

    
      
      game = this.playGame(game);
      

      this.printGameScore(game);

      games.push(game);

        if (game.score[0] > game.score[1]) {
          console.log(`${this.team1.name} wins the game!`);
          set.winner = this.team1;
        } else {
          console.log(`${this.team2.name} wins the game!`);
          set.winner = this.team2;
        }

        console.log(`Game score: ${this.team1.name}: ${game.score[0]} | ${this.team2.name}: ${game.score[1]}\n`);
      
    

    set.games = games;
  }

  private playMatch(): void {
    // log if team1 or team2 has won the match
    console.log(this.match.winner)

    // play sets until one team has won the match
    for (let i = 0; i < this.match.numberOfSets; i++) {
      if (!this.match.winner) {
        console.log(`Set ${i + 1}:`);
        const set: Set = { games: [] };
        this.playSet(set);
        this.match.sets.push(set);
      }
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
        rl.question('Enter the number of Sets: ', (numberOfSets) => {

        rl.close();

        const match: Match = { 
          sets: [], 
          numberOfSets: parseInt(numberOfSets, 10),
          winner: undefined
        };

        const team1: Team = {
          name: team1Name,
          score: 0,
          experience: parseInt(team1Experience, 10),
          advantage: 0
        };

        const team2: Team = {
          name: team2Name,
          score: 0,
          experience: parseInt(team2Experience, 10),
          advantage: 0
        };

        const game = new PadelGame(team1, team2, match);
        game.startGame();
      });
    });
    });
  });
});
