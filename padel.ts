import * as readline from 'readline';
import { Team, Match, Point, PadelSet } from './types';

export class PadelGame {
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
            console.log('');
            console.log(`--- Starting a new set --- ${setIndex + 1}`)
            
            const set: PadelSet = { team1Games: 0, team2Games: 0, winner: undefined };
            this.playSet(set);
            this.match.sets.push(set);
            
            // temporary score of the set
            if (this.match.sets.length > 0) {
                
                console.log('---');
                console.log(`       ${this.team1.name} - ${this.team2.name}`);
                console.log('');
                for (let i = 0; i < this.match.sets.length; i++) {
                    console.log(`Set ${i + 1}: ${this.match.sets[i].team1Games} - ${this.match.sets[i].team2Games}`);
                }
                console.log('---');
            }
            
            console.log('')
            
            
            const team1Sets = this.match.sets.filter((set) => set.winner === this.team1.name).length;
            const team2Sets = this.match.sets.filter((set) => set.winner === this.team2.name).length;
            console.log(`${team1Sets} - ${team2Sets}`);
            
            if(team1Sets > team2Sets) {
                this.match.winner = this.team1.name;
            }
            if (team2Sets > team1Sets) {
                this.match.winner = this.team2.name;
            }
            if (team1Sets === team2Sets) {
                console.log('Tie');
                this.match.winner = 'None';
            }
            this.match.winner ? console.log('Match winner:', this.match.winner) : null;
        }
    }  
    
    playSet(set: PadelSet) {
        while (!set.winner) {
            const game: [number, number] = [0, 0];
            this.playGame(game);
            
            console.log('Score of the last game:', game[0], '-', game[1])
            
            // accumulate the score of the set
            if (game[0] === 3 && game[0] > game[1]) {
                
                set.team1Games++
            }
            if (game[1] === 3 && game[1] > game[0]) {
                set.team2Games++
            }
            
            console.log('Game\'s Set Game Score:', set.team1Games, '-', set.team2Games);
            console.log('');
            
            // If the team with advantage wins more than 5 games
            if(set.team1Games >= 6 || set.team2Games >= 6) {
                
                if (set.team1Games - set.team2Games >= 2) {
                    set.winner = this.team1.name;
                } 
                
                if (set.team2Games - set.team1Games >= 2) {
                    set.winner = this.team2.name;
                } 
                
                if (set.team1Games === set.team2Games && (set.team1Games >= 6 || set.team2Games >= 6)) {
                    this.handleDeuce(game);
                }
            }
        }
        
        
        console.log('Set winner:', set.winner);
    }
    
    playGame(game: [number, number]) {
        while (!this.isGameComplete(game)) {
            console.log("New Game");
            console.log('---');
            console.log('');
            const winningTeam = this.calculatePointWinner();
            console.log('Game winner:', game[0] > game[1] ? this.team1.name : this.team2.name);
            game[winningTeam]++;
            console.log('Game score:', Point[game[0]], '-', Point[game[1]]);
            // console.log('Game score:', game[0], '-', game[1]);
        }
        console.log('');
        console.log('--- End Game ---');
    }
    
    isGameComplete(game: [number, number]): boolean {
        return game[0] === 3 || game[1] === 3;
    }
    
    handleDeuce(game: [number, number]) {
        console.log('Deuce!');
        
        let advantagePoints: [number, number] = [0, 0];
        let prevWinner: number | null = null;
        
        let advantageTeam: number | null = null;
        
        while (advantageTeam === null) {
            console.log(`Advantage points: ${advantagePoints[0]} - ${advantagePoints[1]}`)
            
            const winningTeam = this.calculatePointWinner();
            advantagePoints[winningTeam]++;
            
            if (prevWinner !== winningTeam) {
                console.log("Back in Deuce!");
                advantagePoints[winningTeam] = 0;
                console.log(`Advantage p: ${advantagePoints[0]} - ${advantagePoints[1]}`)
            }
            
            prevWinner = winningTeam;
            
            
            // If the team with advantage wins 2 consecutive points
            if (advantagePoints[winningTeam] === 2) {
                console.log(winningTeam === 0 ? this.team1.name : this.team2.name, 'wins the game!');
                advantageTeam = winningTeam;
            }
        }
        
        console.log('Game winner:', advantageTeam === 0 ? this.team1.name : this.team2.name);
    }
    
    calculatePointWinner(): number {
        return Math.random() < this.team1.experience / (this.team1.experience + this.team2.experience) ? 0 : 1;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const promptUserInput = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (input: string) => {
            resolve(input);
        });
    });
};

const promptNumberInput = async (question: string): Promise<number> => {
    while (true) {
        const input = await promptUserInput(question);
        const number = parseInt(input, 10);
        if (!isNaN(number) && number >= 0 && number <= 100) {
            return number;
        }
        
        console.log('Invalid input. Please enter a number.\n');
    }
};

const readInputs = async () => {
    try {
        const team1Name = await promptUserInput('Enter the name of Team 1: ');
        const team2Name = await promptUserInput('Enter the name of Team 2: ');
        const team1Experience = await promptNumberInput('Enter the experience level of Team 1 (0-100): ');
        const team2Experience = await promptNumberInput('Enter the experience level of Team 2 (0-100): ');
        const numberOfSets = await promptNumberInput('Enter the number of Sets: ');
        
        rl.close();
        
        const match = {
            sets: [],
            numberOfSets,
            winner: undefined,
        };
        
        const team1 = {
            name: team1Name,
            score: 0,
            experience: team1Experience,
        };
        
        const team2 = {
            name: team2Name,
            score: 0,
            experience: team2Experience,
        };
        
        const game = new PadelGame(team1, team2, match);
        game.startGame();
    } catch (error: unknown) {
        console.log(error);
        rl.close();
    }
};

readInputs();