import * as readline from 'readline';

enum Point {
    Love = 0,
    Fifteen = 1,
    Thirty = 2,
    Forty = 3,
}

interface Team {
    score: number;
    name: string;
    experience: number;
    advantage: 0 | 1 | 2;
}

interface Set {
    winner: string | undefined;
    gamesScore: [number, number];
}

interface Game {
    team1: Team;
    team2: Team;
    winner: string | undefined;
    score: [Point, Point];
    games: Record<number, number>;
}

interface Match {
    sets: Set[];
    numberOfSets: number;
    winner?: string;
    setsScore: [number, number];
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
    
    startMatch() {
        
        // Play Sets in the Match by cycling through sets
        for (let setIndex = 0; setIndex < this.match.numberOfSets; setIndex++) {
            
            const set: Set = {
                // games: [], 
                winner: undefined,
                gamesScore: [0, 0],
            };


            console.log('--- Starting a new set ---')
            console.log(`Set ${setIndex + 1}`)
            
            
            // this.playSet(set);
            while (!set.winner) {
                const game: Game = {
                    team1: { ...this.team1 },
                    team2: { ...this.team2 },
                    winner: undefined,
                    score: [Point.Love, Point.Love],
                    games: <Record<number, number>>{},
                };
                
                console.log('--- Starting a new game ---')
                while (!game.winner) {
                    
                    const winningTeam: Team = this.calculatePointWinner(game.team1, game.team2);
                    console.log(`Team: ${winningTeam.name} wins the point`);
               

                    // update score
                    if (winningTeam.name === game.team1.name) { // Team 1 wins the point
                        // update gameScore value adding 1 Point
                        game.score[0] = game.score[0] + 1;
                    } else { // Team 2 wins the point
                        game.score[1] = game.score[0] + 1;
                    }

                    // Check if a team has won the turn
                    if (game.score[0] === 3 || game.score[1] === 3) {
                        console.log('Turn winner:', winningTeam.name);
                        game.winner = game.score[0] === 3 ? game.team1.name : game.team2.name;
                    }

                    console.log(`Temporary score: Team1 ${game.score[0]} - Team2 ${game.score[1]}`)


                }

                // set winning team

                
                
                console.log('Game winner:', game.winner);
                
                if (game.winner) {
                    set.winner = game.winner;
                }
                
                console.log(`Temoporary set score Team1 ${game.team1.score} - Team2 ${game.team2.score}`)
                console.log(`Winner of the game: ${game.winner}`)
            }
            
        
            
            // Check if a team has already won the match
            if (this.match.winner) {
                break;
            }
        }

        console.log(`this.match.winner: ${this.match.winner}`)
        
        // Determine the winner of the match
        const team1Sets = this.match.sets.filter((set) => set.winner === this.team1.name).length;
        console.log(`Team1's total sets won: ${team1Sets}`)
        const team2Sets = this.match.sets.filter((set) => set.winner === this.team2.name).length;
        console.log(`Team2's total sets won: ${team2Sets}`)
        
        if (team1Sets > team2Sets) {
            this.match.winner = this.team1.name;
        } else if (team2Sets > team1Sets) {
            this.match.winner = this.team2.name;
        }
        
        console.log('Match winner:', this.match.winner);
    }
    

    
   
    
    handleDeuce(game: Game) {
        // Implement the logic for handling "Deuce" and "Advantage" situations
        // You can modify this based on the game rules of Padel
        console.log(`Deuce between ${game.team1.name} and ${game.team2.name}`);
        
        // Use readline or other means to get input from the user for the advantage winner
        // Update game.team1.advantage and game.team2.advantage based on the input
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
                    };
                    
                    const team2: Team = {
                        name: team2Name,
                        experience: parseInt(team2Experience, 10),
                        advantage: 0,
                    };
                    
                    const startMatch = new PadelGame(team1, team2, match);
                    startMatch.startMatch();
                });
            });
        });
    });
});