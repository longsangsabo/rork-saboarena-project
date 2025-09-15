/**
 * WebSocket hooks for real-time functionality
 * Provides connection management and real-time challenge updates
 */

import { useState, useEffect, useCallback } from 'react';

// Types for WebSocket functionality
interface WebSocketConnection {
  isConnected: boolean;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: string;
}

interface ChallengeNotification {
  challengerName: string;
  challengeId: string;
  type: 'new_challenge' | 'challenge_accepted' | 'challenge_completed';
  timestamp: string;
}

interface RealTimeChallenge {
  challenges: any[] | null;
  newChallengeNotification: ChallengeNotification | null;
  clearNotification: () => void;
}

// Mock WebSocket connection hook
export function useWebSocketConnection(): WebSocketConnection {
  const [connectionState, setConnectionState] = useState<WebSocketConnection>({
    isConnected: false,
    status: 'disconnected'
  });

  useEffect(() => {
    // Simulate connection for development
    if (__DEV__) {
      setConnectionState({
        isConnected: true,
        status: 'connected'
      });
    }

    // In production, implement actual WebSocket connection
    // const ws = new WebSocket('wss://your-websocket-server.com');
    // ws.onopen = () => setConnectionState({ isConnected: true, status: 'connected' });
    // ws.onclose = () => setConnectionState({ isConnected: false, status: 'disconnected' });
    // ws.onerror = (error) => setConnectionState({ isConnected: false, status: 'error', error: error.message });

    return () => {
      // Cleanup WebSocket connection
      // ws?.close();
    };
  }, []);

  return connectionState;
}

// Mock real-time challenge updates hook
export function useRealTimeChallenge(): RealTimeChallenge {
  const [challenges] = useState<any[] | null>(null);
  const [notification, setNotification] = useState<ChallengeNotification | null>(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    // Mock real-time updates for development
    if (__DEV__) {
      // Simulate receiving challenge updates
      const interval = setInterval(() => {
        // Randomly trigger notifications for testing
        if (Math.random() > 0.95) {
          setNotification({
            challengerName: 'Test Player',
            challengeId: 'test-challenge-' + Date.now(),
            type: 'new_challenge',
            timestamp: new Date().toISOString()
          });
        }
      }, 5000);

      return () => clearInterval(interval);
    }

    // In production, listen to WebSocket messages
    // const handleMessage = (event: MessageEvent) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'challenge_update') {
    //     setChallenges(data.challenges);
    //   } else if (data.type === 'notification') {
    //     setNotification(data.notification);
    //   }
    // };

    return () => {
      // Cleanup listeners
    };
  }, []);

  return {
    challenges,
    newChallengeNotification: notification,
    clearNotification
  };
}

// WebSocket message sender hook
export function useWebSocketSender() {
  const sendMessage = useCallback((message: any) => {
    // Validate message before sending
    if (!message || typeof message !== 'object') {
      console.warn('Invalid message format');
      return;
    }
    
    if (__DEV__) {
      console.log('WebSocket message (dev mode):', message);
      return;
    }

    // In production, send actual WebSocket message
    // ws?.send(JSON.stringify(message));
  }, []);

  return { sendMessage };
}

// Tournament update notification interface
interface TournamentUpdate {
  type: 'started' | 'ended' | 'player_joined' | 'player_left';
  tournamentName: string;
  message: string;
  timestamp: string;
}

// Real-time tournament updates hook
export function useRealTimeTournament() {
  const [tournaments, setTournaments] = useState<any[] | null>(null);
  const [tournamentUpdate, setTournamentUpdate] = useState<TournamentUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearUpdate = useCallback(() => {
    setTournamentUpdate(null);
  }, []);

  useEffect(() => {
    // Mock tournament updates for development
    if (__DEV__) {
      // Simulate receiving tournament updates
      const interval = setInterval(() => {
        // Randomly trigger tournament notifications for testing
        if (Math.random() > 0.98) {
          setTournamentUpdate({
            type: 'player_joined',
            tournamentName: 'SABO Championship 2025',
            message: 'Có người chơi mới tham gia!',
            timestamp: new Date().toISOString()
          });
        }
      }, 10000);

      return () => clearInterval(interval);
    }

    // In production, listen to WebSocket messages for tournament updates
    return () => {
      // Cleanup listeners
    };
  }, []);

  return {
    tournaments,
    tournamentUpdate,
    clearUpdate,
    isLoading
  };
}

export default {
  useWebSocketConnection,
  useRealTimeChallenge,
  useWebSocketSender,
  useRealTimeTournament
};