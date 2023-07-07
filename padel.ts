import * as readline from 'readline';

enum Point {
    Love = 0,
    Fifteen = 1,
    Thirty = 2,
    Forty = 3,
}

interface Team {
    name: string;
    score: number;
    experience: number;
    advantage: 0 | 1 | 2;
    winner?: Team;
}

interface Set {
    winner: Team;
    gamesScore: [number, number];
    numberOfGames: number;
}

interface Game {
    team1: Team;
    team2: Team;
    winner: Team | undefined;
    // score: [Point, Point];
    score: [number, number];
}

interface Match {
    sets: Set[];
    winner?: Team;
    numberOfSets: number;
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
                numberOfGames: 0
            };
            
            
            console.log('--- Starting a new set ---')
            console.log('')

            console.log(`Set ${setIndex + 1}`)
            
            
            // this.playSet(set);
            while (!this.match.winner) {
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
                    console.log(`Point winner: ${winningTeam.name}`)
                    console.log('')
                    
                    winningTeam.score++;
                    
                    if (winningTeam.name === game.team1.name) { // Team 1 wins the point
                        // update gameScore value adding 1 Point
                        game.score[0] = game.score[0] + 1;
                    } else { // Team 2 wins the point
                        game.score[1] = game.score[0] + 1;
                    }
                    console.log(`Temporary score of the game: Team1 ${Point[set.gamesScore[0]]} - Team2 ${Point[set.gamesScore[1]]}`)

                    // Check if a team has won the turn
                    // if (game.score[0] === 3 || game.score[1] === 3) {
                    //     game.winner = game.score[0] === 3 ? game.team1 : game.team2;
                    //     // game.winner.name === game.team1.name ? set.gamesScore[0]++ : set.gamesScore[1]++;
                    //     set.gamesScore[0] = game.score[0] === 3 ? game.score[0] + 1 : null;
                    //     set.gamesScore[1] = game.score[1] === 3 ? game.score[1] + 1 : null

                    // }

                    if (game.score[0] === 3 || game.score[1] === 3) {
                        const winnerIndex = game.score[0] === 3 ? 0 : 1;
                      
                        game.winner = winnerIndex === 0 ? game.team1 : game.team2;
                        set.gamesScore[winnerIndex] = set.gamesScore[winnerIndex] + 1;
                    }

                    set.numberOfGames++;
                    console.log(`Number of games played: ${set.numberOfGames}`)

                    // if number of games won in a set is more then 5, check if a team has won the set
                    

                }
                
            // console.log('Game winner:', game.winner.name);

            // calculate the winner of the set
                if (
                    set.gamesScore[0] >= 5 || set.gamesScore[1] >= 5 && 
                    (
                    set.gamesScore[0] - set.gamesScore[1] >= 2 ||
                    set.gamesScore[0] - set.gamesScore[1] > 5)) {

                    const winnerIndex = set.gamesScore[0] >= 5 || set.gamesScore[1] >= 5 && 
                    (
                    set.gamesScore[0] - set.gamesScore[1] >= 2 ||
                    set.gamesScore[0] - set.gamesScore[1] > 5) ? 0 : 1;

                    console.log(`Set winner : ${game[winnerIndex].name}`)
                    
                    this.match.setsScore[winnerIndex] = this.match.setsScore[winnerIndex] + 1;
                    
                    
                    // set.winner = winnerIndex === 0 ? game.team1 : game.team2;
                    // this.match.setsScore[winnerIndex] = this.match.setsScore[winnerIndex] + 1;
                }

                
                console.log(`Temoporary set score Team1 ${game.team1.score} - Team2 ${game.team2.score}`)
                console.log(`Winner of the match: ${game.winner}`)
                
        }
          
            // console.log('Set winner:', set.winner);
            
            // save result of the game in gamescore
            // set.gamesScore[0] = set.games.filter((game) => game.winner === this.team1.name).length;
            // this.match.sets.push(set);
            
            // Check if a team has already won the match
            
            if (this.match.winner) {
                break;
            }
        }
        
        console.log(`this.match.winner: ${this.match.winner}`)
        
        
        // if (team1Sets > team2Sets) {
        //     this.match.winner = this.team1.name;
        // } else if (team2Sets > team1Sets) {
        //     this.match.winner = this.team2.name;
        // }
        
        console.log('Match winner:', this.match.winner);
    }
    
    // playSet(set: Set) {
    
    //     // Play games within the set until one team wins
    //     while (!set.winner) {
    //         const game: Game = { 
    //             team1: { ...this.team1 }, 
    //             team2: { ...this.team2 }, 
    //             winner: undefined 
    //         };
    
    //         this.playGame(game);
    
    //         console.log(`Game ${set.gamesScore[0] + set.gamesScore[1] + 1}`)
    //         set.gamesScore[0] = set.gamesScore[0] + game.team1.score;
    //         // set.games.push(game.team1.score);
    //         // set.games.push(game.team2.score);
    
    //         // Check if a team has already won the set
    //         if (game.winner) {
    //             set.winner = game.winner;
    //         }
    //         console.log(`Temoporary set score Team1 ${game.team1.score} - Team2 ${game.team2.score}`)
    //         console.log(`Winner of the game: ${game.winner}`)
    //     }
    
    //     console.log('Set winner:', set.winner);
    // }
    
    // playGame(game: Game, set: Set) {
    //     // Play points within the game until one team wins
    //     console.log('--- Starting a new game ---')
    //     console.log('')
    //     while (!game.winner) {
            
    //         const winningTeam = this.calculatePointWinner(game.team1, game.team2);
            
    //         winningTeam.score++;
            
    //         // Check if a team has won the game
    //         // if (winningTeam.score >= 4 && winningTeam.score - 2 >= game.team2.score) {
    //         //     game.winner = winningTeam.name;
    //         // } else if (game.team1.score === 40 && game.team2.score === 40) {
    //         //     this.handleDeuce(game);
    //         // }
    //     }
        
    //     console.log('Game winner:', game.winner);

    //     set.gamesScore[0] = set.gamesScore[0] + 1;
        
    //     // set.gameScore[0] = set.gameScore[0] + game.team1.score;
    // }
    
    // handleDeuce(game: Game) {
    //     // Implement the logic for handling "Deuce" and "Advantage" situations
    //     // You can modify this based on the game rules of Padel
    //     console.log(`Deuce between ${game.team1.name} and ${game.team2.name}`);
        
    //     // Use readline or other means to get input from the user for the advantage winner
    //     // Update game.team1.advantage and game.team2.advantage based on the input
    // }
    
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