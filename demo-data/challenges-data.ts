export interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  isOnline: boolean;
}

export interface Challenge {
  id: string;
  status: 'waiting' | 'ready' | 'live' | 'finished';
  date: string;
  time: string;
  handicap: string;
  spa: number;
  raceToScore: number;
  tableNumber: number;
  player1: Player;
  player2?: Player;
}

export const mockChallenges: Challenge[] = [
  // Waiting challenges
  {
    id: '1',
    status: 'waiting',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  {
    id: '2',
    status: 'waiting',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  {
    id: '3',
    status: 'waiting',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  // Live challenges
  {
    id: '4',
    status: 'live',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
    player2: {
      id: 'p2',
      name: 'Long Sang',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  {
    id: '5',
    status: 'ready',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
    player2: {
      id: 'p2',
      name: 'Long Sang',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  {
    id: '6',
    status: 'ready',
    date: 'T7 - 06/09',
    time: '19:00',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'p1',
      name: 'C. Ramos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
    player2: {
      id: 'p2',
      name: 'Long Sang',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
  // Finished challenges
  {
    id: '7',
    status: 'finished',
    date: 'T6 - 05/09',
    time: '20:30',
    handicap: 'Hanicap 0.5 ván',
    spa: 100,
    raceToScore: 7,
    tableNumber: 2,
    player1: {
      id: 'p3',
      name: 'Minh Duc',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      rank: 'G',
      isOnline: false,
    },
    player2: {
      id: 'p4',
      name: 'Thanh Tung',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true,
    },
  },
];

export const getChallengesByStatus = (status: 'waiting' | 'live' | 'finished') => {
  if (status === 'live') {
    return mockChallenges.filter(challenge => challenge.status === 'live' || challenge.status === 'ready');
  }
  return mockChallenges.filter(challenge => challenge.status === status);
};