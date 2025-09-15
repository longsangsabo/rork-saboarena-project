import { TournamentMatch, Player, GameInfo } from '../components/tournaments/MatchCard';

// Mock players data
const mockPlayers: Player[] = [
  { id: '1', name: 'C. Ramos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop', rank: 'H' },
  { id: '2', name: 'Long Sang', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', rank: 'H' },
  { id: '3', name: 'Minh Tuấn', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop', rank: 'G' },
  { id: '4', name: 'Văn Nam', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop', rank: 'F' },
  { id: '5', name: 'Hoàng Anh', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop', rank: 'H' },
  { id: '6', name: 'Thanh Sơn', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=60&h=60&fit=crop', rank: 'G' },
  { id: '7', name: 'Đức Thành', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=60&h=60&fit=crop', rank: 'F' },
  { id: '8', name: 'Quang Huy', avatar: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=60&h=60&fit=crop', rank: 'H' },
  { id: '9', name: 'Trung Kiên', avatar: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=60&h=60&fit=crop', rank: 'G' },
  { id: '10', name: 'Bảo Long', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=60&h=60&fit=crop', rank: 'F' },
  { id: '11', name: 'An Khang', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop', rank: 'H' },
  { id: '12', name: 'Phi Long', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop', rank: 'G' },
];

// Standard game info
const standardGameInfo: GameInfo = {
  handicap: 'Handicap 0.5 ván',
  table: 'Bàn 1',
  raceType: 'Race to 7'
};

// Tournament bracket structure based on the image
export function generateWinnersBracketData(): TournamentMatch[] {
  const matches: TournamentMatch[] = [];

  // Round 1 (WINNER ROUND 101-108) - 8 matches
  const round1Matches = [
    {
      id: 'winner_round_101',
      label: 'WINNER ROUND 101',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0], // C. Ramos wins
      nextMatchId: 'winner_round_201'
    },
    {
      id: 'winner_round_102', 
      label: 'WINNER ROUND 102',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_201'
    },
    {
      id: 'winner_round_103',
      label: 'WINNER ROUND 103', 
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_202'
    },
    {
      id: 'winner_round_104',
      label: 'WINNER ROUND 104',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang 
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_202'
    },
    {
      id: 'winner_round_105',
      label: 'WINNER ROUND 105',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_203'
    },
    {
      id: 'winner_round_106',
      label: 'WINNER ROUND 106',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_203'
    },
    {
      id: 'winner_round_107',
      label: 'WINNER ROUND 107',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_204'
    },
    {
      id: 'winner_round_108',
      label: 'WINNER ROUND 108',
      player1: mockPlayers[0], // C. Ramos
      player2: mockPlayers[1], // Long Sang
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_204'
    }
  ];

  // Round 2 (WINNER ROUND 201-204) - 4 matches
  const round2Matches = [
    {
      id: 'winner_round_201',
      label: 'WINNER ROUND 201',
      player1: mockPlayers[0], // Winner from 101
      player2: mockPlayers[1], // Winner from 102
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_301'
    },
    {
      id: 'winner_round_202',
      label: 'WINNER ROUND 202',
      player1: mockPlayers[0], // Winner from 103
      player2: mockPlayers[1], // Winner from 104
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_301'
    },
    {
      id: 'winner_round_203',
      label: 'WINNER ROUND 203',
      player1: mockPlayers[0], // Winner from 105
      player2: mockPlayers[1], // Winner from 106
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_302'
    },
    {
      id: 'winner_round_204',
      label: 'WINNER ROUND 204',
      player1: mockPlayers[0], // Winner from 107
      player2: mockPlayers[1], // Winner from 108
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'completed' as const,
      winner: mockPlayers[0],
      nextMatchId: 'winner_round_302'
    }
  ];

  // Round 3 (WINNER ROUND 301-302) - Semi Finals
  const round3Matches = [
    {
      id: 'winner_round_301',
      label: 'SEMI FINAL ROUND 1',
      player1: mockPlayers[0], // Winner from 201
      player2: mockPlayers[1], // Winner from 202
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'in_progress' as const,
      nextMatchId: 'winner_final'
    },
    {
      id: 'winner_round_302',
      label: 'SEMI FINAL ROUND 2', 
      player1: mockPlayers[0], // Winner from 203
      player2: mockPlayers[1], // Winner from 204
      score: { player1: 2, player2: 2 },
      gameInfo: standardGameInfo,
      status: 'in_progress' as const,
      nextMatchId: 'winner_final'
    }
  ];

  // Final
  const finalMatch = {
    id: 'winner_final',
    label: 'FINAL',
    player1: null, // Winner from Semi 1
    player2: null, // Winner from Semi 2
    score: null,
    gameInfo: standardGameInfo,
    status: 'pending' as const
  };

  matches.push(...round1Matches, ...round2Matches, ...round3Matches, finalMatch);
  
  return matches;
}

// Helper function to advance winner to next match
export function advanceWinner(matches: TournamentMatch[], completedMatchId: string, winner: Player): TournamentMatch[] {
  const updatedMatches = [...matches];
  const completedMatch = updatedMatches.find(m => m.id === completedMatchId);
  
  if (!completedMatch || !completedMatch.nextMatchId) {
    return updatedMatches;
  }

  // Update completed match with winner
  completedMatch.winner = winner;
  completedMatch.status = 'completed';

  // Find next match and add winner
  const nextMatch = updatedMatches.find(m => m.id === completedMatch.nextMatchId);
  if (nextMatch) {
    if (!nextMatch.player1) {
      nextMatch.player1 = winner;
    } else if (!nextMatch.player2) {
      nextMatch.player2 = winner;
    }

    // If both players are set, match is ready
    if (nextMatch.player1 && nextMatch.player2 && nextMatch.status === 'pending') {
      nextMatch.status = 'pending'; // Ready to start
    }
  }

  return updatedMatches;
}

// Helper function to get match progression map
export function getMatchProgressionMap(matches: TournamentMatch[]): Map<string, string[]> {
  const progressionMap = new Map<string, string[]>();
  
  matches.forEach(match => {
    if (match.nextMatchId) {
      if (!progressionMap.has(match.nextMatchId)) {
        progressionMap.set(match.nextMatchId, []);
      }
      progressionMap.get(match.nextMatchId)!.push(match.id);
    }
  });

  return progressionMap;
}