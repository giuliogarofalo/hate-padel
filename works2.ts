import * as readline from 'readline';

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

interface MatchSet {
  games: Game[];
  winner?: Team;
}

interface Match {
  sets: MatchSet[];
  winner?: Team;
}

class PadelGame {
  private team1: Team;
  private team2: Team;
  private match: Match;

  constructor(team1: Team, team2: Team) {
    this.team1 = team1;
    this.team2 = team2;
    this.match = {
      sets: [],
    };
  }

  private playGame(): Team {
    const randomWinner = Math.random() < 0.5 ? this.team1 : this.team2;
    const randomLoser = randomWinner === this.team1 ? this.team2 : this.team1;

    const winnerExperienceFactor = randomWinner.experience / (randomWinner.experience + randomLoser.experience);
    const randomValue = Math.random();

    if (randomValue < winnerExperienceFactor) {
      randomWinner.score++;
    } else {
      randomLoser.score++;
    }

    return randomWinner;
  }

  private logGameScore(game: Game): void {
    const [score1, score2] = game.score;
    console.log(`Game score: ${game.team1.name}: ${Point[score1]} | ${game.team2.name}: ${Point[score2]}`);
  }

  private playSet(): void {
    let team1Games = 0;
    let team2Games = 0;
    const games: Game[] = [];

    while (team1Games < 6 && team2Games < 6) {
      const gameWinner = this.playGame();

      if (gameWinner === this.team1) {
        team1Games++;
      } else {
        team2Games++;
      }

      const game: Game = {
        team1: { ...this.team1 },
        team2: { ...this.team2 },
        gameState: GameState.GameOver,
        score: [team1Games, team2Games],
      };

      games.push(game);

      if (team1Games === 3 && team2Games === 3) {
        game.gameState = GameState.Deuce;
        console.log('Game status: Deuce');
      }

      this.logGameScore(game);
    }

    const set: MatchSet = {
      games,
    };

    this.match.sets.push(set);

    const lastGame = games[games.length - 1];
    console.log(`Game score: ${lastGame.team1.name}: ${Point[lastGame.score[0]]} | ${lastGame.team2.name}: ${Point[lastGame.score[1]]}`);
  }

  private determineGameState(game: Game): void {
    const [team1Score, team2Score] = game.score;

    if (team1Score === team2Score) {
      if (team1Score >= 3) {
        game.gameState = GameState.Deuce;
        console.log('Game status: Deuce');
      } else {
        game.gameState = GameState.GameOver;
      }
    } else if (team1Score > 3 || team2Score > 3) {
      if (Math.abs(team1Score - team2Score) >= 2) {
        game.gameState = GameState.GameOver;
      } else {
        game.gameState = GameState.Advantage;
        console.log('Game status: Advantage');
      }
    } else {
      game.gameState = GameState.GameOver;
    }
  }

  private logSetScore(set: MatchSet): void {
    const setNumber = this.match.sets.length;
    const winner = set.winner ? set.winner.name : 'Tie';
    console.log(`Set ${setNumber}: ${winner}`);
  }

  private logMatchScore(): void {
    const team1Sets = this.match.sets.filter(set => set.winner === this.team1).length;
    const team2Sets = this.match.sets.filter(set => set.winner === this.team2).length;

    console.log(`\n${this.team1.name} Sets: ${team1Sets}`);
    console.log(`${this.team2.name} Sets: ${team2Sets}`);
  }

  private playMatch(): void {
    while (true) {
      this.playSet();
      const currentSet = this.match.sets[this.match.sets.length - 1];
      const lastGame = currentSet.games[currentSet.games.length - 1];
      this.determineGameState(lastGame);
  
      if (lastGame.gameState === GameState.Advantage) {
        this.playGame();
  
        if (this.team1.score > this.team2.score) {
          lastGame.team1.score++;
        } else {
          lastGame.team2.score++;
        }
  
        this.determineGameState(lastGame);
  
        if (lastGame.gameState === GameState.Advantage || lastGame.gameState === GameState.GameOver) {
          const setWinner = lastGame.score[0] > lastGame.score[1] ? this.team1 : this.team2;
          currentSet.winner = setWinner;
  
          this.logSetScore(currentSet);
  
          if (setWinner === this.team1) {
            this.team1.score++;
          } else {
            this.team2.score++;
          }
  
          this.logMatchScore();
  
          if (setWinner === this.team1 && this.team1.score === Math.ceil(this.match.sets.length / 2) + 1) {
            this.match.winner = this.team1;
            break;
          } else if (setWinner === this.team2 && this.team2.score === Math.ceil(this.match.sets.length / 2) + 1) {
            this.match.winner = this.team2;
            break;
          }
        }
      } else if (lastGame.gameState === GameState.GameOver) {
        const setWinner = lastGame.score[0] > lastGame.score[1] ? this.team1 : this.team2;
        currentSet.winner = setWinner;
  
        this.logSetScore(currentSet);
  
        if (setWinner === this.team1) {
          this.team1.score++;
        } else {
          this.team2.score++;
        }
  
        this.logMatchScore();
  
        if (setWinner === this.team1 && this.team1.score === Math.ceil(this.match.sets.length / 2) + 1) {
          this.match.winner = this.team1;
          break;
        } else if (setWinner === this.team2 && this.team2.score === Math.ceil(this.match.sets.length / 2) + 1) {
          this.match.winner = this.team2;
          break;
        }
      }
    }
  
    console.log('\n--- Match Result ---');
    console.log(`Winner: ${this.match.winner!.name}\n`);
  
    console.log('--- Set Results ---');
    this.match.sets.forEach((set, index) => {
      const setNumber = index + 1;
      const winner = set.winner ? set.winner.name : 'Tie';
  
      console.log(`Set ${setNumber}: ${winner}`);
  
      set.games.forEach((game, gameIndex) => {
        console.log(`Game ${gameIndex + 1}: Team 1 points - ${Point[game.score[0]]}, Team 2 points - ${Point[game.score[1]]}`);
      });
  
      console.log('');
    });
  }

  public startGame(): void {
    console.log('--- Welcome to the Padel Game ---');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the name of Team 1: ', (team1Name) => {
      rl.question('Enter the name of Team 2: ', (team2Name) => {
        rl.question('Enter the experience level of Team 1 (0-100): ', (team1Experience) => {
          rl.question('Enter the experience level of Team 2 (0-100): ', (team2Experience) => {
            rl.close();

            this.team1.name = team1Name;
            this.team2.name = team2Name;
            this.team1.experience = parseInt(team1Experience, 10);
            this.team2.experience = parseInt(team2Experience, 10);

            console.log(`Teams: ${this.team1.name} vs ${this.team2.name}\n`);

            this.playMatch();
          });
        });
      });
    });
  }
}

const team1: Team = {
  name: '',
  score: 0,
  experience: 0,
};

const team2: Team = {
  name: '',
  score: 0,
  experience: 0,
};

const game = new PadelGame(team1, team2);
game.startGame();
