import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

// Define proper WebSocket interface for cross-platform compatibility
interface CustomWebSocket {
  readyState: number;
  onopen: ((event: any) => void) | null;
  onclose: ((event: any) => void) | null;
  onmessage: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  send: (data: string) => void;
  close: () => void;
}

// WebSocket ready states
const WS_READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

interface WebSocketMessage {
  type: 'challenge_update' | 'tournament_update' | 'match_update' | 'notification' | 'feed_update';
  data: any;
  timestamp: number;
}

interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
}

export const useWebSocket = (config: WebSocketConfig) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
  });

  const ws = useRef<CustomWebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const messageListeners = useRef<Map<string, (data: any) => void>>(new Map());

  const { url, reconnectInterval = 3000, maxReconnectAttempts = 5 } = config;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WS_READY_STATE.OPEN) return;

    // Skip WebSocket connection on web for now to avoid errors
    if (Platform.OS === 'web') {
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        isConnecting: false, 
        error: 'WebSocket not supported on web in development mode' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const websocket = new WebSocket(url) as any;
      ws.current = websocket as CustomWebSocket;

      websocket.onopen = () => {
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false, 
          error: null 
        }));
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: message }));
          
          // Notify specific listeners
          const listener = messageListeners.current.get(message.type);
          if (listener) {
            listener(message.data);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      websocket.onclose = () => {
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false 
        }));
        console.log('WebSocket disconnected');
        
        // Auto-reconnect if not max attempts reached
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          reconnectTimer.current = setTimeout(connect, reconnectInterval);
        }
      };

      websocket.onerror = (error: any) => {
        setState(prev => ({ 
          ...prev, 
          error: 'WebSocket connection error',
          isConnecting: false 
        }));
        console.error('WebSocket error occurred:', error);
      };

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to create WebSocket connection',
        isConnecting: false 
      }));
      console.error('WebSocket connection failed:', error);
    }
  }, [url, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (!message) return false;
    
    // Skip sending on web for now
    if (Platform.OS === 'web') {
      console.log('WebSocket message (web dev mode):', message);
      return true;
    }
    
    if (ws.current && ws.current.readyState === WS_READY_STATE.OPEN) {
      try {
        ws.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    return false;
  }, []);

  const subscribe = useCallback((messageType: string, callback: (data: any) => void) => {
    if (!messageType?.trim()) return () => {};
    
    messageListeners.current.set(messageType, callback);
    
    return () => {
      messageListeners.current.delete(messageType);
    };
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    subscribe,
  };
};

// Real-time hooks for specific features
export const useRealTimeChallenge = (challengeId?: string) => {
  const [challengeUpdates, setChallengeUpdates] = useState<any>(null);
  
  const ws = useWebSocket({
    url: `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001'}/challenges`,
  });

  useEffect(() => {
    if (!challengeId) return;

    const unsubscribe = ws.subscribe('challenge_update', (data) => {
      if (data && typeof data === 'object' && data.challengeId === challengeId) {
        setChallengeUpdates(data);
      }
    });

    // Send subscription message
    ws.sendMessage({
      type: 'subscribe_challenge',
      challengeId,
    });

    return () => {
      unsubscribe();
      ws.sendMessage({
        type: 'unsubscribe_challenge',
        challengeId,
      });
    };
  }, [challengeId, ws]);

  return {
    ...ws,
    challengeUpdates,
  };
};

export const useRealTimeTournament = (tournamentId?: string) => {
  const [tournamentUpdates, setTournamentUpdates] = useState<any>(null);
  
  const ws = useWebSocket({
    url: `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001'}/tournaments`,
  });

  useEffect(() => {
    if (!tournamentId) return;

    const unsubscribe = ws.subscribe('tournament_update', (data) => {
      if (data && typeof data === 'object' && data.tournamentId === tournamentId) {
        setTournamentUpdates(data);
      }
    });

    ws.sendMessage({
      type: 'subscribe_tournament',
      tournamentId,
    });

    return () => {
      unsubscribe();
      ws.sendMessage({
        type: 'unsubscribe_tournament',
        tournamentId,
      });
    };
  }, [tournamentId, ws]);

  return {
    ...ws,
    tournamentUpdates,
  };
};

export const useRealTimeFeed = () => {
  const [feedUpdates, setFeedUpdates] = useState<any[]>([]);
  
  const ws = useWebSocket({
    url: `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001'}/feed`,
  });

  useEffect(() => {
    const unsubscribe = ws.subscribe('feed_update', (data) => {
      if (data && typeof data === 'object') {
        setFeedUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50 updates
      }
    });

    ws.sendMessage({
      type: 'subscribe_feed',
    });

    return () => {
      unsubscribe();
      ws.sendMessage({
        type: 'unsubscribe_feed',
      });
    };
  }, [ws]);

  return {
    ...ws,
    feedUpdates,
    clearUpdates: () => setFeedUpdates([]),
  };
};

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const ws = useWebSocket({
    url: `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001'}/notifications`,
  });

  useEffect(() => {
    const unsubscribe = ws.subscribe('notification', (data) => {
      if (data && typeof data === 'object') {
        setNotifications(prev => [data, ...prev]);
      }
    });

    ws.sendMessage({
      type: 'subscribe_notifications',
    });

    return () => {
      unsubscribe();
    };
  }, [ws]);

  const markAsRead = useCallback((notificationId: string) => {
    if (!notificationId?.trim()) return;
    
    ws.sendMessage({
      type: 'mark_notification_read',
      notificationId,
    });
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, [ws]);

  return {
    ...ws,
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    clearAll: () => setNotifications([]),
  };
};