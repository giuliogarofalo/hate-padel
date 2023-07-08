import * as readline from 'readline';

interface Team {
    name: string;
    score: number;
    experience: number;
}

interface Set {
    team1Games: number;
    team2Games: number;
    winner: string | undefined;
}

interface Match {
    sets: Set[];
    numberOfSets: number;
    winner: string | undefined;
}

class TennisGame {
    team1: Team;
    team2: Team;
    match: Match;
    
    constructor(team1: Team, team2: Team, match: Match) {
        this.team1 = team1;
        this.team2 = team2;
        this.match = match;
    }
    
    startGame() {
        for (let setIndex = 0; setIndex < this.match.numberOfSets; setIndex++) {
            const set: Set = { team1Games: 0, team2Games: 0, winner: undefined };
            this.playSet(set);
            this.match.sets.push(set);
            
            if (this.match.winner) {
                break;
            }
        }
        
        const team1Sets = this.match.sets.filter((set) => set.winner === this.team1.name).length;
        const team2Sets = this.match.sets.filter((set) => set.winner === this.team2.name).length;
        
        if(team1Sets > 5 && team2Sets > 5) {
            if (team1Sets > team2Sets) {
                this.match.winner = this.team1.name;
            }
            if (team2Sets > team1Sets) {
                this.match.winner = this.team2.name;
            }
            console.log('Match winner:', this.match.winner);
        } 
    }  
    
    
    playSet(set: Set) {
        while (!set.winner) {
            const game: [number, number] = [0, 0];
            this.playGame(game);
            set.team1Games += game[0];
            set.team2Games += game[1];
            
            // If the team with advantage wins more than 5 games
            if(set.team1Games >= 5 || set.team2Games >= 5) {

                if (set.team1Games - set.team2Games >= 2) {
                    set.winner = this.team1.name;
                } 

                if (set.team2Games - set.team1Games >= 2) {
                    set.winner = this.team2.name;
                } 
                    
                if (set.team1Games === set.team2Games && set.team1Games >= 5) {
                    this.handleDeuce(game);
                }
            }
        }
        
        
        console.log('Set winner:', set.winner);
    }
    
    playGame(game: [number, number]) {
        while (!this.isGameComplete(game)) {
            const winningTeam = this.calculatePointWinner();
            game[winningTeam]++;
        }
        
        console.log('Game winner:', game[0] > game[1] ? this.team1.name : this.team2.name);
    }
    
    isGameComplete(game: [number, number]): boolean {
        return (game[0] >= 4 && game[0] - game[1] >= 2) || (game[1] >= 4 && game[1] - game[0] >= 2);
    }
    
    handleDeuce(game: [number, number]) {
        console.log('Deuce!');
        let advantageTeam: number | null = null;
        
        while (advantageTeam === null) {
            const winningTeam = this.calculatePointWinner();
            game[winningTeam]++;
            
            if (game[winningTeam] === game[1 - winningTeam] + 2) {
                advantageTeam = winningTeam;
            } else if (game[winningTeam] === game[1 - winningTeam] + 1) {
                console.log('Advantage!', winningTeam === 0 ? this.team1.name : this.team2.name);
            } else {
                console.log('Deuce!');
            }
        }
        
        console.log('Deuce! Game winner:', advantageTeam === 0 ? this.team1.name : this.team2.name);
    }
    
    calculatePointWinner(): number {
        return Math.random() < this.team1.experience / (this.team1.experience + this.team2.experience) ? 0 : 1;
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
                    };
                    
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
                    
                    const game = new TennisGame(team1, team2, match);
                    game.startGame();
                });
            });
        });
    });
});
