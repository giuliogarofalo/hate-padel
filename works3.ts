import * as readline from 'readline';
import { Match, Team, Game, Point, MatchSet } from './types';


class PadelGame {
    private team1: Team;
    private team2: Team;
    private match: Match;
    
    constructor() {
        this.team1 = { name: '', score: 0, experience: 0 }
        this.team2 = { name: '', score: 0, experience: 0 };
        this.match = { numberOfSets: 0, sets: [] };
    }
    
    public startGame(): void {
        console.log('--- Welcome to the Padel Game ---');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        
        rl.question('Enter the name of Team 1: ', (team1Name) => {
            rl.question('Enter the name of Team 2: ', (team2Name) => {
                rl.question('Enter the experience level of Team 1 (0-100): ', (team1Experience: string ) => {
                    rl.question('Enter the experience level of Team 2 (0-100): ', (team2Experience: string) => {
                        rl.question('Enter the number of sets to play: ', (numberOfSets: string) => {
                            rl.close();
                            
                            this.team1.name = team1Name;
                            this.team2.name = team2Name;
                            this.team1.experience = parseInt(team1Experience, 10);
                            this.team2.experience = parseInt(team2Experience, 10);
                            this.match.numberOfSets = parseInt(numberOfSets, 10);
                            
                            console.log(`Teams: ${this.team1.name} with ${this.team1.experience} vs ${this.team2.name} experience with ${this.team2.experience} experience`);
                            console.log(`Number of sets to play: ${numberOfSets}\n`);
                            
                            this.playMatch();
                        });
                    });
                });
            });
        });
    }
    private getRandomWinner(): Team {
        return Math.random() < 0.5 ? this.team1 : this.team2;
      }
      
    private playGame(): Team {
        const randomWinner = Math.random() < 0.5 ? this.team1 : this.team2;
        const randomLoser = randomWinner === this.team1 ? this.team2 : this.team1;
        
        const winnerExperienceFactor = randomWinner.experience / (randomWinner.experience + randomLoser.experience);
        const randomValue = Math.random();

        const

        if (randomValue < winnerExperienceFactor) {
          randomWinner.score++;
        } else {
          randomLoser.score++;
        }
    
        return randomWinner;
      }
    
    private playSet(): void {
        // {[key: matchNumber]: winner}
        const matchSet: MatchSet = { games: [] };
        const team1 = this.team1;
        const team2 = this.team2;

        const gamesToWin = 6;
        const gamesToWinByTwo = 2;
        const numberOfGames = 12;
        const numberOfGamesToDeuce = 6;
        const numberOfGamesToTieBreak = 6;
        const numberOfPointsToWinTieBreak = 7;
        const numberOfPointsToWinGame = 4;
        const numberOfPointsToWinGameByTwo = 2;


        const gameWinner = this.playGame();
    }



    private playMatch(): void {
        
        console.log('--- Starting the match ---');
        const numberOfSets = this.match.numberOfSets
        
        for (let i = 0; i < numberOfSets; i++) {
            console.log(`--- Starting set ${i + 1} ---`);
            this.playSet();
            
            // const currentSet = this.match.sets[this.match.sets.length - 1];
            // console.log(`CurrentSet ${this.match.sets.length} winner: ${currentSet.winner ? currentSet.winner.name : 'Tie'}`);
        }
        
        console.log('--- Match ended ---');
        
    }
}

const game = new PadelGame();
game.startGame();

