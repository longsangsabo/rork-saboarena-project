import { useState, useEffect, useCallback, useRef } from 'react';

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

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const messageListeners = useRef<Map<string, (data: any) => void>>(new Map());

  const { url, reconnectInterval = 3000, maxReconnectAttempts = 5 } = config;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false, 
          error: null 
        }));
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
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

      ws.current.onclose = () => {
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

      ws.current.onerror = (error) => {
        setState(prev => ({ 
          ...prev, 
          error: 'WebSocket connection error',
          isConnecting: false 
        }));
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to create WebSocket connection',
        isConnecting: false 
      }));
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
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const subscribe = useCallback((messageType: string, callback: (data: any) => void) => {
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
      if (data.challengeId === challengeId) {
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
      if (data.tournamentId === tournamentId) {
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
      setFeedUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50 updates
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
      setNotifications(prev => [data, ...prev]);
    });

    ws.sendMessage({
      type: 'subscribe_notifications',
    });

    return () => {
      unsubscribe();
    };
  }, [ws]);

  const markAsRead = useCallback((notificationId: string) => {
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