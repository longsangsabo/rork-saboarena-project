export interface Challenge {
  id: string;
  status: 'waiting' | 'ready' | 'live' | 'finished';
  date: string;
  time: string;
  handicap: string;
  spa: number;
  raceToScore: number;
  tableNumber: number;
  player1?: {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    isOnline: boolean;
  } | null;
  player2?: {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    isOnline: boolean;
  } | null;
}

// Mock challenge data
const mockChallenges: Challenge[] = [
  {
    id: 'challenge_1',
    status: 'waiting',
    date: '2024-01-15',
    time: '14:30',
    handicap: 'Handicap 0.5 ván',
    spa: 50,
    raceToScore: 7,
    tableNumber: 1,
    player1: {
      id: 'player_1',
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rank: 'H',
      isOnline: true
    },
    player2: null
  },
  {
    id: 'challenge_2',
    status: 'ready',
    date: '2024-01-15',
    time: '15:00',
    handicap: 'Handicap 1 ván',
    spa: 75,
    raceToScore: 9,
    tableNumber: 2,
    player1: {
      id: 'player_2',
      name: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      rank: 'I',
      isOnline: true
    },
    player2: {
      id: 'player_3',
      name: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'H+',
      isOnline: false
    }
  },
  {
    id: 'challenge_3',
    status: 'live',
    date: '2024-01-15',
    time: '15:30',
    handicap: 'Không handicap',
    spa: 100,
    raceToScore: 11,
    tableNumber: 3,
    player1: {
      id: 'player_4',
      name: 'Phạm Văn D',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      rank: 'A',
      isOnline: true
    },
    player2: {
      id: 'player_5',
      name: 'Hoàng Thị E',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      rank: 'A+',
      isOnline: true
    }
  },
  {
    id: 'challenge_4',
    status: 'finished',
    date: '2024-01-15',
    time: '13:00',
    handicap: 'Handicap 0.5 ván',
    spa: 60,
    raceToScore: 7,
    tableNumber: 4,
    player1: {
      id: 'player_6',
      name: 'Vũ Văn F',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rank: 'H+',
      isOnline: false
    },
    player2: {
      id: 'player_7',
      name: 'Đặng Thị G',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      rank: 'I',
      isOnline: false
    }
  },
  {
    id: 'challenge_5',
    status: 'waiting',
    date: '2024-01-15',
    time: '16:00',
    handicap: 'Handicap 1.5 ván',
    spa: 80,
    raceToScore: 9,
    tableNumber: 5,
    player1: {
      id: 'player_8',
      name: 'Bùi Văn H',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      rank: 'A',
      isOnline: true
    },
    player2: null
  },
  {
    id: 'challenge_6',
    status: 'live',
    date: '2024-01-15',
    time: '16:30',
    handicap: 'Không handicap',
    spa: 120,
    raceToScore: 11,
    tableNumber: 6,
    player1: {
      id: 'player_9',
      name: 'Ngô Thị I',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      rank: 'A+',
      isOnline: true
    },
    player2: {
      id: 'player_10',
      name: 'Dương Văn J',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      rank: 'A+',
      isOnline: true
    }
  }
];

// Helper function to get challenges by status
export function getChallengesByStatus(status: 'waiting' | 'live' | 'finished'): Challenge[] {
  return mockChallenges.filter(challenge => challenge.status === status);
}

// Helper function to get all challenges
export function getAllChallenges(): Challenge[] {
  return mockChallenges;
}

// Helper function to get challenge by ID
export function getChallengeById(id: string): Challenge | undefined {
  return mockChallenges.find(challenge => challenge.id === id);
}

// Helper function to create a new challenge
export function createChallenge(challengeData: Omit<Challenge, 'id'>): Challenge {
  const newChallenge: Challenge = {
    ...challengeData,
    id: `challenge_${Date.now()}`
  };
  mockChallenges.push(newChallenge);
  return newChallenge;
}

// Helper function to update challenge status
export function updateChallengeStatus(id: string, status: Challenge['status']): Challenge | null {
  const challengeIndex = mockChallenges.findIndex(challenge => challenge.id === id);
  if (challengeIndex !== -1) {
    mockChallenges[challengeIndex].status = status;
    return mockChallenges[challengeIndex];
  }
  return null;
}

// Helper function to join a challenge
export function joinChallenge(challengeId: string, player: Challenge['player2']): Challenge | null {
  const challengeIndex = mockChallenges.findIndex(challenge => challenge.id === challengeId);
  if (challengeIndex !== -1 && !mockChallenges[challengeIndex].player2) {
    mockChallenges[challengeIndex].player2 = player;
    mockChallenges[challengeIndex].status = 'ready';
    return mockChallenges[challengeIndex];
  }
  return null;
}