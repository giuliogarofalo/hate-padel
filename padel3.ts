import * as readline from 'readline';

enum Point {
    Love = 0,
    Fifteen = 1,
    Thirty = 2,
    Forty = 3,
}

interface Team {
    score: any;
    name: string;
    experience: number;
    advantage: 0 | 1 | 2;
    winner?: Team;
}

//////////////

interface Match {
    winner?: Team; // Team that has half + 1 sets won
    numberOfSets: number;
    setsScore?: [number, string][]
}

interface Set {
    winner: Team | undefined;
    gamesScore: [number, string][];
    team1score: number;
    team2score: number;
}

interface Game {
    team1: Team;
    team2: Team;
    winner: Team | undefined;
    score: [number, number];
}

class PadelGame {
    team1: Team;
    team2: Team;
    match: Match;
    
    constructor(team1: Team, team2: Team, match: Match) {
        this.team1 = team1;
        this.team2 = team2;
        this.match = match;
    }

    calculatePointWinner(team1: Team, team2: Team): Team {
        // Implement an algorithm to determine the winner of each point randomly based on team experience
        // You can use the team's experience values to calculate probabilities
        
        // Return the winning team based on the algorithm
        // For example:
        const randomValue = Math.random();
        const winnerExperienceFactor = team1.experience / (team1.experience + team2.experience);
        const winner = randomValue < winnerExperienceFactor ? team1 : team2;
        return winner;
    }

    
    startMatch() {
        
        // Play Sets in the Match by cycling through sets
        for (let setIndex = 0; setIndex < this.match.numberOfSets; setIndex++) {
            
            const set: Set = {
                winner: undefined,
                gamesScore: [],
                team1score: 0,
                team2score: 0
            };

            console.log(`--- Starting a new set --- ${setIndex + 1}`)
            console.log('')
            
            while (!set.winner) {
               
                const game: Game = {
                    team1: { ...this.team1 },
                    team2: { ...this.team2 },
                    winner: undefined,
                    score: [Point.Love, Point.Love],
                };
                
                // this.playGame(game);
                console.log('--- Starting a new game ---')
                console.log('')
    
                while (!game.winner) {
                    
                    // turns
                    const winningTeam: Team = this.calculatePointWinner(game.team1, game.team2);
                    const losingTeam: Team = winningTeam.name === game.team1.name ? game.team2 : game.team1;
                    console.log(`Point winner: ${winningTeam.name}`)
                    console.log('')
                    
                    // winningTeam.score++;
                    
                    if (winningTeam.name === game.team1.name) {
                        winningTeam.score++
                    } else {
                        losingTeam.score++
                    }

                    console.log(`Temporary score of the game: ${winningTeam.name} ${Point[winningTeam.score]} - ${losingTeam.name} ${Point[losingTeam.score]}`)
    
                    if (winningTeam.score === 3) {
                        console.log(`Winner of the game: ${winningTeam.name}`)
                        set.gamesScore.push([setIndex, winningTeam.name])
                        // set.gamesScore.push([setIndex, winningTeam.score])
                        
                        // console.log(set.gamesScore, 'set.gamesScore')
                    }
                   
                    
                } // end while (!game.winner) {

                // fill two variables with the score of the teams in set
                const team1Score = set.gamesScore.filter((set) => set[1] === this.team1.name).length;
                const team2Score = set.gamesScore.filter((set) => set[1] === this.team2.name).length;
                
                // if set.gamesScore.length > 5 game can finish
                if (team1Score > 5 && team2Score > 5 && (
                    (
                        team1Score - team2Score >= 2 &&
                        team1Score - team1Score > 5
                    )
                )) {
                    if (team1Score > team2Score) {
                        set.winner = this.team1;
                        console.log(`Winner of the set: ${set.winner.name}`)
                        
                        this.match.setsScore?.push([setIndex, set.winner.name])
                    }

                    if (team2Score === team1Score) {
                        console.log('Deuce!')

                        const advantagePoints = [0,0];
                       
                        // play game
                        const winningTeam = this.calculatePointWinner(game.team1, game.team2);

                    }


                }
            
                    
                    // set.winner = winnerIndex === 0 ? game.team1 : game.team2;
                    // this.match.setsScore[winnerIndex] = this.match.setsScore[winnerIndex] + 1;

            
            } // end while (!set.winner) {
    
                
            // console.log(`Temoporary set score Team1 ${game.team1.score} - Team2 ${game.team2.score}`)
            // console.log(`Winner of the match: ${game.winner}`)
                

            
 
            
            if (this.match.winner) {
                break;
            }
        
        } // end of match
        
        console.log(`Winner of the match: ${this.match.winner}`)
        
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
                        winner: undefined,
                        setsScore: [0, 0],
                    };
                    
                    const team1: Team = {
                        name: team1Name,
                        experience: parseInt(team1Experience, 10),
                        advantage: 0,
                        score: 0
                    };
                    
                    const team2: Team = {
                        name: team2Name,
                        experience: parseInt(team2Experience, 10),
                        advantage: 0,
                        score: 0
                    };
                    
                    const startMatch = new PadelGame(team1, team2, match);
                    startMatch.startMatch();
                });
            });
        });
    });
});