import readlineSync from 'readline-sync';

// Each team can have either of these points in one game “0” “15” “30” “40” “A”
const POINTS = ['0', '15', '30', '40', 'A'];
const DEUCE = 'Deuce!';

// Function to randomly determine the winner based on team experience
export function determineWinner(team1Experience: number, team2Experience: number): number {
  const totalExperience = team1Experience + team2Experience;
  const randomValue = Math.random() * totalExperience;
  // return 1 if randomValue is less than team1Experience otherwise return 2
  return randomValue < team1Experience ? 1 : 2;
}

// Function to play a single game
export function playGame(team1Experience: number, team2Experience: number): number | undefined {
  let team1Score = 0;
  let team2Score = 0;

  // while (true) {
  const winner = determineWinner(team1Experience, team2Experience);
  if (winner === 1) {
    team1Score++;
  } else {
    team2Score++;
  }

  // log the score after each point
  
  if (team1Score >= 4 && team1Score - team2Score >= 2) {
    return 1;
  }
  
  if (team2Score >= 4 && team2Score - team1Score >= 2) {
    return 2;
  }
  
  if (team1Score === 3 && team2Score === 3) {
    console.log(DEUCE);
    return 0;
  }
  console.log(`${POINTS[team1Score]} - ${POINTS[team2Score]}`);
  // }
}

// Function to play a set
export function playSet(team1Experience: number, team2Experience: number): number | undefined {
  let team1Games = 0;
  let team2Games = 0;

  const gameWinner = playGame(team1Experience, team2Experience);

  if (gameWinner === 1) {
    team1Games++;
  } else if (gameWinner === 2) {
    team2Games++;
  }

  // If the team with advantage wins more than 5 games and the difference with the games win by the other team is greater or equal to 2, the team with advantage wins the set
  if (team1Games >= 6 && team1Games - team2Games >= 2) {
    return 1;
  }

  if (team2Games >= 6 && team2Games - team1Games >= 2) {
    return 2;
  }

  // log "Deuce" if both teams have 40 points
  if (gameWinner === 0) {
    console.log(DEUCE);
  }
}

// Function to play a match
export function playMatch(
  team1Experience: number,
  team2Experience: number,
  totalSets: number
): number {
  let team1Sets = 0;
  let team2Sets = 0;

  // sets number of sets for each team based on totalSets
  while (team1Sets < Math.ceil(totalSets / 2) && team2Sets < Math.ceil(totalSets / 2)) {

    const setWinner = playSet(team1Experience, team2Experience);
    
    if (setWinner === 1) {
      team1Sets++;
    } else {
      team2Sets++;
    }
    // log the score after each set
    console.log(`\Score: ${team1Sets} - ${team2Sets}\n`);

    
  }
  
  // log theScore
  console.log(`\Score: ${team1Sets} - ${team2Sets}\n`);
  return team1Sets > team2Sets ? 1 : 2;
}

function promptForValidInteger(question: string): number {
  let value: number;
  do {
    value = parseInt(readlineSync.question(question), 10);
  } while (!Number.isInteger(value));
  return value;
}

// Function to prompt the user for match and team configurations
function promptUser(): void {
  
  const team1Name = readlineSync.question('Enter the name of the first team: ');
  const team1Experience = promptForValidInteger('Enter the experience of the first team: (number)');
  console.log('--------------------');
  console.log(`\nTeam: ${team1Name} has ${team1Experience} experience points`);
  console.log('--------------------');


  const team2Name = readlineSync.question('Enter the name of the second team: ');
  const team2Experience = promptForValidInteger('Enter the experience of the second team: (number)');
  console.log('--------------------');
  console.log(`\nTeam: ${team2Name} has ${team2Experience} experience points`);
  console.log('--------------------');

  const totalSets = promptForValidInteger('Enter the total number of sets in the match: ');

  const matchWinner = playMatch(
    team1Experience, 
    team2Experience, 
    totalSets);

  console.log(`\n${team1Name} vs ${team2Name}`);
  console.log('--------------------');
  console.log(`Match winner: ${matchWinner === 1 ? team1Name : team2Name}`);
}

// Run the program if executed directly
if (require.main === module) {
    promptUser();
}
  
module.exports = {
    determineWinner,
    playGame,
    playSet,
    playMatch,
  };
