import { TournamentMatch, Player, MatchScore, GameInfo } from '@/components/tournaments/MatchCard';

// Generate demo players for losers bracket
const generateLoserPlayer = (id: string, name: string): Player => ({
  id,
  name,
  rank: 'H',
  avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000) + 1500000000000}?w=60&h=60&fit=crop`,
});

// Generate Branch A matches (8 losers from Winners Round 1)
export function generateBranchAMatches(): TournamentMatch[] {
  const matches: TournamentMatch[] = [];
  
  // Branch A Round 1: 8 players → 4 matches → 4 winners
  const branchARound1Players = [
    generateLoserPlayer('losers_a_1', 'Player LA1'),
    generateLoserPlayer('losers_a_2', 'Player LA2'),
    generateLoserPlayer('losers_a_3', 'Player LA3'),
    generateLoserPlayer('losers_a_4', 'Player LA4'),
    generateLoserPlayer('losers_a_5', 'Player LA5'),
    generateLoserPlayer('losers_a_6', 'Player LA6'),
    generateLoserPlayer('losers_a_7', 'Player LA7'),
    generateLoserPlayer('losers_a_8', 'Player LA8'),
  ];

  // Round 1 matches (4 matches)
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `losers_a_round_1_match_${i + 1}`,
      label: `LOSERS A ROUND 1`,
      player1: branchARound1Players[i * 2],
      player2: branchARound1Players[i * 2 + 1],
      score: {
        player1: Math.floor(Math.random() * 8),
        player2: Math.floor(Math.random() * 8)
      },
      gameInfo: {
        table: `Bàn ${i + 1}`,
        handicap: 'Handicap 0.5 ván',
        raceType: 'Race to 7'
      },
      status: Math.random() > 0.3 ? 'completed' : 'in_progress',
      nextMatchId: `losers_a_round_2_match_${Math.floor(i / 2) + 1}`,
    });
  }

  // Round 2 matches (2 matches)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `losers_a_round_2_match_${i + 1}`,
      label: `LOSERS A ROUND 2`,
      player1: generateLoserPlayer(`losers_a_r2_${i * 2 + 1}`, 'Winner LA R1'),
      player2: generateLoserPlayer(`losers_a_r2_${i * 2 + 2}`, 'Winner LA R1'),
      score: {
        player1: Math.floor(Math.random() * 8),
        player2: Math.floor(Math.random() * 8)
      },
      gameInfo: {
        table: `Bàn ${i + 5}`,
        handicap: 'Handicap 0.5 ván',
        raceType: 'Race to 7'
      },
      status: Math.random() > 0.5 ? 'completed' : 'pending',
      nextMatchId: 'losers_a_round_3_match_1',
    });
  }

  // Round 3 match (1 match - Final)
  matches.push({
    id: 'losers_a_round_3_match_1',
    label: 'LOSERS A ROUND 3',
    player1: generateLoserPlayer('losers_a_r3_1', 'Winner LA R2'),
    player2: generateLoserPlayer('losers_a_r3_2', 'Winner LA R2'),
    score: null,
    gameInfo: {
      table: 'Bàn Final A',
      handicap: 'Handicap 0.5 ván',
      raceType: 'Race to 7'
    },
    status: 'pending',
    nextMatchId: 'losers_final_stage',
  });

  return matches;
}

// Generate Branch B matches (4 losers from Winners Round 2)
export function generateBranchBMatches(): TournamentMatch[] {
  const matches: TournamentMatch[] = [];
  
  // Branch B Round 1: 4 players → 2 matches → 2 winners
  const branchBRound1Players = [
    generateLoserPlayer('losers_b_1', 'Player LB1'),
    generateLoserPlayer('losers_b_2', 'Player LB2'),
    generateLoserPlayer('losers_b_3', 'Player LB3'),
    generateLoserPlayer('losers_b_4', 'Player LB4'),
  ];

  // Round 1 matches (2 matches)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `losers_b_round_1_match_${i + 1}`,
      label: `LOSERS B ROUND 1`,
      player1: branchBRound1Players[i * 2],
      player2: branchBRound1Players[i * 2 + 1],
      score: {
        player1: Math.floor(Math.random() * 8),
        player2: Math.floor(Math.random() * 8)
      },
      gameInfo: {
        table: `Bàn ${i + 10}`,
        handicap: 'Handicap 0.5 ván',
        raceType: 'Race to 7'
      },
      status: Math.random() > 0.4 ? 'completed' : 'in_progress',
      nextMatchId: 'losers_b_round_2_match_1',
    });
  }

  // Round 2 match (1 match - Final)
  matches.push({
    id: 'losers_b_round_2_match_1',
    label: 'LOSERS B ROUND 2',
    player1: generateLoserPlayer('losers_b_r2_1', 'Winner LB R1'),
    player2: generateLoserPlayer('losers_b_r2_2', 'Winner LB R1'),
    score: null,
    gameInfo: {
      table: 'Bàn Final B',
      handicap: 'Handicap 0.5 ván',
      raceType: 'Race to 7'
    },
    status: 'pending',
    nextMatchId: 'losers_final_stage',
  });

  return matches;
}

// Main function to generate complete Losers' Bracket
export function generateLosersBracketData(): TournamentMatch[] {
  const branchAMatches = generateBranchAMatches();
  const branchBMatches = generateBranchBMatches();
  
  return [...branchAMatches, ...branchBMatches];
}

// Helper function to get round number from match label
function getRoundFromLabel(label: string): number {
  const match = label.match(/ROUND (\d+)/);
  return match ? parseInt(match[1]) : 1;
}

// Function to populate losers from Winners' bracket
export function populateLosersFromWinners(
  winnerMatches: TournamentMatch[],
  losersMatches: TournamentMatch[]
): TournamentMatch[] {
  const updatedLosersMatches = [...losersMatches];
  
  // Populate Branch A from Winners Round 1 losers
  const winnersRound1 = winnerMatches.filter(match => 
    getRoundFromLabel(match.label) === 1 && match.label.includes('WINNER')
  );
  const losersARound1 = updatedLosersMatches.filter(match => 
    match.label.includes('LOSERS A ROUND 1')
  );
  
  winnersRound1.forEach((winnerMatch, index) => {
    if (winnerMatch.status === 'completed' && losersARound1[Math.floor(index / 2)] && winnerMatch.score) {
      const loser = winnerMatch.score.player1 > winnerMatch.score.player2 ? winnerMatch.player2 : winnerMatch.player1;
      const loserMatchIndex = updatedLosersMatches.findIndex(m => m.id === losersARound1[Math.floor(index / 2)].id);
      
      if (loserMatchIndex !== -1 && loser) {
        if (index % 2 === 0) {
          updatedLosersMatches[loserMatchIndex].player1 = loser;
        } else {
          updatedLosersMatches[loserMatchIndex].player2 = loser;
        }
      }
    }
  });

  // Populate Branch B from Winners Round 2 losers
  const winnersRound2 = winnerMatches.filter(match => 
    getRoundFromLabel(match.label) === 2 && match.label.includes('WINNER')
  );
  const losersBRound1 = updatedLosersMatches.filter(match => 
    match.label.includes('LOSERS B ROUND 1')
  );
  
  winnersRound2.forEach((winnerMatch, index) => {
    if (winnerMatch.status === 'completed' && losersBRound1[Math.floor(index / 2)] && winnerMatch.score) {
      const loser = winnerMatch.score.player1 > winnerMatch.score.player2 ? winnerMatch.player2 : winnerMatch.player1;
      const loserMatchIndex = updatedLosersMatches.findIndex(m => m.id === losersBRound1[Math.floor(index / 2)].id);
      
      if (loserMatchIndex !== -1 && loser) {
        if (index % 2 === 0) {
          updatedLosersMatches[loserMatchIndex].player1 = loser;
        } else {
          updatedLosersMatches[loserMatchIndex].player2 = loser;
        }
      }
    }
  });

  return updatedLosersMatches;
}

// Advance winner in losers bracket
export function advanceLosersBracketWinner(
  matches: TournamentMatch[],
  matchId: string,
  winnerId: string
): TournamentMatch[] {
  const updatedMatches = [...matches];
  const currentMatch = updatedMatches.find(m => m.id === matchId);
  
  if (!currentMatch || !currentMatch.nextMatchId) return updatedMatches;
  
  const winner = currentMatch.player1?.id === winnerId ? currentMatch.player1 : currentMatch.player2;
  const nextMatchIndex = updatedMatches.findIndex(m => m.id === currentMatch.nextMatchId);
  
  if (nextMatchIndex !== -1 && winner) {
    const nextMatch = updatedMatches[nextMatchIndex];
    if (!nextMatch.player1) {
      updatedMatches[nextMatchIndex].player1 = winner;
    } else if (!nextMatch.player2) {
      updatedMatches[nextMatchIndex].player2 = winner;
    }
  }
  
  return updatedMatches;
}