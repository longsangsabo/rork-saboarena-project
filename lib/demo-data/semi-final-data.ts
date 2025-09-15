import { TournamentMatch, Player, MatchScore, GameInfo } from '@/components/tournaments/MatchCard';

// Generate demo players for semi final
const generateSemiFinalPlayer = (id: string, name: string, source: string): Player => ({
  id,
  name,
  rank: 'H',
  avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000) + 1500000000000}?w=60&h=60&fit=crop`,
});

// Generate Semi Final matches structure
export function generateSemiFinalData(): TournamentMatch[] {
  const matches: TournamentMatch[] = [];

  // Semi Final Round 1: Winners Player 1 vs Losers Branch A Champion
  matches.push({
    id: 'semi_final_round_1',
    label: 'SEMI FINAL ROUND 1',
    player1: generateSemiFinalPlayer('sf_p1', 'Winners P1', 'winners_semi_final_winner_1'),
    player2: generateSemiFinalPlayer('sf_p2', 'Losers A Champ', 'losers_branch_a_champion'),
    score: {
      player1: Math.floor(Math.random() * 8),
      player2: Math.floor(Math.random() * 8)
    },
    gameInfo: {
      table: 'Bàn 1',
      handicap: 'Handicap 0.5 ván',
      raceType: 'Race to 7'
    },
    status: Math.random() > 0.5 ? 'completed' : 'in_progress',
    nextMatchId: 'final_match',
  });

  // Semi Final Round 2: Winners Player 2 vs Losers Branch B Champion
  matches.push({
    id: 'semi_final_round_2',
    label: 'SEMI FINAL ROUND 2',
    player1: generateSemiFinalPlayer('sf_p3', 'Winners P2', 'winners_semi_final_winner_2'),
    player2: generateSemiFinalPlayer('sf_p4', 'Losers B Champ', 'losers_branch_b_champion'),
    score: {
      player1: Math.floor(Math.random() * 8),
      player2: Math.floor(Math.random() * 8)
    },
    gameInfo: {
      table: 'Bàn 2',
      handicap: 'Handicap 0.5 ván',
      raceType: 'Race to 7'
    },
    status: Math.random() > 0.5 ? 'completed' : 'pending',
    nextMatchId: 'final_match',
  });

  // Final Match: Winner of SF Round 1 vs Winner of SF Round 2
  matches.push({
    id: 'final_match',
    label: 'FINAL',
    player1: generateSemiFinalPlayer('final_p1', 'Semi R1 Winner', 'semi_final_round_1_winner'),
    player2: generateSemiFinalPlayer('final_p2', 'Semi R2 Winner', 'semi_final_round_2_winner'),
    score: null,
    gameInfo: {
      table: 'Bàn Final',
      handicap: 'Handicap 0.5 ván',
      raceType: 'Race to 7'
    },
    status: 'pending',
    nextMatchId: undefined, // Tournament ends here
  });

  return matches;
}

// Auto-populate Semi Final players from completed brackets
export function populateSemiFinalFromBrackets(
  winnersMatches: TournamentMatch[],
  losersMatches: TournamentMatch[],
  semiFinalMatches: TournamentMatch[]
): TournamentMatch[] {
  const updatedSemiMatches = [...semiFinalMatches];

  // Find winners bracket semi final winners (assuming last 2 matches in winners are semi finals)
  const winnersSemiMatches = winnersMatches
    .filter(match => match.status === 'completed' && match.label.includes('WINNER ROUND'))
    .slice(-2); // Last 2 matches should be semi finals

  // Find losers branch champions (final matches of each branch)
  const losersBranchAChampion = losersMatches
    .find(match => match.status === 'completed' && match.label.includes('LOSERS A ROUND 3'));
  
  const losersBranchBChampion = losersMatches
    .find(match => match.status === 'completed' && match.label.includes('LOSERS B ROUND 2'));

  // Populate Semi Final Round 1
  const semiRound1Index = updatedSemiMatches.findIndex(m => m.id === 'semi_final_round_1');
  if (semiRound1Index !== -1) {
    // Winners bracket player 1
    if (winnersSemiMatches[0] && winnersSemiMatches[0].score) {
      const winner1 = winnersSemiMatches[0].score.player1 > winnersSemiMatches[0].score.player2 
        ? winnersSemiMatches[0].player1 
        : winnersSemiMatches[0].player2;
      if (winner1) {
        updatedSemiMatches[semiRound1Index].player1 = winner1;
      }
    }
    
    // Losers Branch A champion
    if (losersBranchAChampion && losersBranchAChampion.score) {
      const championA = losersBranchAChampion.score.player1 > losersBranchAChampion.score.player2
        ? losersBranchAChampion.player1
        : losersBranchAChampion.player2;
      if (championA) {
        updatedSemiMatches[semiRound1Index].player2 = championA;
      }
    }
  }

  // Populate Semi Final Round 2
  const semiRound2Index = updatedSemiMatches.findIndex(m => m.id === 'semi_final_round_2');
  if (semiRound2Index !== -1) {
    // Winners bracket player 2
    if (winnersSemiMatches[1] && winnersSemiMatches[1].score) {
      const winner2 = winnersSemiMatches[1].score.player1 > winnersSemiMatches[1].score.player2
        ? winnersSemiMatches[1].player1
        : winnersSemiMatches[1].player2;
      if (winner2) {
        updatedSemiMatches[semiRound2Index].player1 = winner2;
      }
    }
    
    // Losers Branch B champion
    if (losersBranchBChampion && losersBranchBChampion.score) {
      const championB = losersBranchBChampion.score.player1 > losersBranchBChampion.score.player2
        ? losersBranchBChampion.player1
        : losersBranchBChampion.player2;
      if (championB) {
        updatedSemiMatches[semiRound2Index].player2 = championB;
      }
    }
  }

  return updatedSemiMatches;
}

// Advance winner in semi final stage
export function advanceSemiFinalWinner(
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
    
    // For semi final to final advancement
    if (matchId === 'semi_final_round_1') {
      updatedMatches[nextMatchIndex].player1 = winner;
    } else if (matchId === 'semi_final_round_2') {
      updatedMatches[nextMatchIndex].player2 = winner;
    }
  }
  
  return updatedMatches;
}

// Check if semi final can start (all prerequisites complete)
export function canStartSemiFinal(
  winnersMatches: TournamentMatch[],
  losersMatches: TournamentMatch[]
): boolean {
  // Check Winners Bracket Semi Final completed (last 2 matches)
  const winnersSemiMatches = winnersMatches
    .filter(match => match.label.includes('WINNER ROUND'))
    .slice(-2);
  const winnersComplete = winnersSemiMatches.length === 2 && 
    winnersSemiMatches.every(match => match.status === 'completed');

  // Check Losers Branch A completed
  const branchAComplete = losersMatches
    .some(match => match.label.includes('LOSERS A ROUND 3') && match.status === 'completed');

  // Check Losers Branch B completed  
  const branchBComplete = losersMatches
    .some(match => match.label.includes('LOSERS B ROUND 2') && match.status === 'completed');

  return winnersComplete && branchAComplete && branchBComplete;
}

// Get tournament final results
export function getTournamentResults(semiFinalMatches: TournamentMatch[]): {
  champion?: Player;
  runnerUp?: Player;
  thirdPlace?: Player[];
} {
  const finalMatch = semiFinalMatches.find(m => m.id === 'final_match');
  const semiMatches = semiFinalMatches.filter(m => m.id.includes('semi_final_round'));
  
  const results: {
    champion?: Player;
    runnerUp?: Player;
    thirdPlace?: Player[];
  } = {};

  // Get champion and runner-up from final
  if (finalMatch && finalMatch.status === 'completed' && finalMatch.score) {
    if (finalMatch.score.player1 > finalMatch.score.player2) {
      results.champion = finalMatch.player1 || undefined;
      results.runnerUp = finalMatch.player2 || undefined;
    } else {
      results.champion = finalMatch.player2 || undefined;
      results.runnerUp = finalMatch.player1 || undefined;
    }
  }

  // Get 3rd/4th place from semi final losers
  const thirdPlaceContenders: Player[] = [];
  semiMatches.forEach(match => {
    if (match.status === 'completed' && match.score) {
      const loser = match.score.player1 > match.score.player2 ? match.player2 : match.player1;
      if (loser) {
        thirdPlaceContenders.push(loser);
      }
    }
  });
  
  if (thirdPlaceContenders.length > 0) {
    results.thirdPlace = thirdPlaceContenders;
  }

  return results;
}