import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: 'challenge' | 'tournament' | 'social' | 'general';
  priority: 'high' | 'normal' | 'low';
}

interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
}

export function usePushNotifications() {
  const [permissions, setPermissions] = useState<NotificationPermissions>({
    granted: false,
    canAskAgain: true,
    status: Notifications.PermissionStatus.UNDETERMINED
  });
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Initialize push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });

    // Listen for notifications while app is running
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Request notification permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    const granted = finalStatus === 'granted';
    setPermissions({
      granted,
      canAskAgain: finalStatus !== 'denied',
      status: finalStatus
    });
    
    return granted;
  };

  // Schedule local notification
  const scheduleLocalNotification = async (notification: Omit<PushNotification, 'id'>, trigger?: Notifications.NotificationTriggerInput) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: {
          ...notification.data,
          type: notification.type,
          priority: notification.priority
        },
        sound: true,
        priority: notification.priority === 'high' ? 
          Notifications.AndroidNotificationPriority.HIGH : 
          Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: trigger || null, // null means show immediately
    });
    
    return notificationId;
  };

  // Cancel scheduled notification
  const cancelNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  // Cancel all notifications
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // Get scheduled notifications
  const getScheduledNotifications = async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
  };

  return {
    permissions,
    expoPushToken,
    notification,
    requestPermissions,
    scheduleLocalNotification,
    cancelNotification,
    cancelAllNotifications,
    getScheduledNotifications,
  };
}

// Helper function to register for push notifications
async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }
  
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {
    console.error('Error getting push token:', error);
  }

  return token;
}

// Handle notification responses (when user taps notification)
function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const { notification } = response;
  const { data } = notification.request.content;
  
  // Handle different notification types
  switch (data?.type) {
    case 'challenge':
      // Navigate to challenges tab or specific challenge
      console.log('Opening challenge:', data.challengeId);
      break;
    case 'tournament':
      // Navigate to tournaments tab or specific tournament
      console.log('Opening tournament:', data.tournamentId);
      break;
    case 'social':
      // Navigate to home feed or profile
      console.log('Opening social:', data.userId);
      break;
    default:
      console.log('Opening app from notification');
  }
}

// Pre-defined notification templates
export const NotificationTemplates = {
  // Challenge notifications
  challengeReceived: (challengerName: string, challengeType: string): Omit<PushNotification, 'id'> => ({
    title: 'Thách đấu mới!',
    body: `${challengerName} đã gửi thách đấu ${challengeType} cho bạn`,
    type: 'challenge',
    priority: 'high',
    data: { challengerName, challengeType }
  }),

  challengeAccepted: (opponentName: string): Omit<PushNotification, 'id'> => ({
    title: 'Thách đấu được chấp nhận!',
    body: `${opponentName} đã chấp nhận thách đấu của bạn`,
    type: 'challenge',
    priority: 'high',
    data: { opponentName }
  }),

  challengeStarting: (opponentName: string, minutes: number): Omit<PushNotification, 'id'> => ({
    title: 'Thách đấu sắp bắt đầu!',
    body: `Trận đấu với ${opponentName} sẽ bắt đầu trong ${minutes} phút`,
    type: 'challenge',
    priority: 'high',
    data: { opponentName, minutes }
  }),

  // Tournament notifications
  tournamentStarting: (tournamentName: string, minutes: number): Omit<PushNotification, 'id'> => ({
    title: 'Giải đấu sắp bắt đầu!',
    body: `${tournamentName} sẽ bắt đầu trong ${minutes} phút`,
    type: 'tournament',
    priority: 'high',
    data: { tournamentName, minutes }
  }),

  tournamentMatchReady: (opponentName: string, round: string): Omit<PushNotification, 'id'> => ({
    title: 'Trận đấu tiếp theo!',
    body: `${round}: Đối thủ ${opponentName} đang chờ bạn`,
    type: 'tournament',
    priority: 'high',
    data: { opponentName, round }
  }),

  tournamentResult: (tournamentName: string, position: number): Omit<PushNotification, 'id'> => ({
    title: 'Kết quả giải đấu!',
    body: `Bạn đã đạt vị trí thứ ${position} trong ${tournamentName}`,
    type: 'tournament',
    priority: 'normal',
    data: { tournamentName, position }
  }),

  // Social notifications
  newFollower: (followerName: string): Omit<PushNotification, 'id'> => ({
    title: 'Người theo dõi mới!',
    body: `${followerName} đã bắt đầu theo dõi bạn`,
    type: 'social',
    priority: 'normal',
    data: { followerName }
  }),

  feedLiked: (likerName: string, postPreview: string): Omit<PushNotification, 'id'> => ({
    title: 'Bài viết được thích!',
    body: `${likerName} đã thích: "${postPreview.substring(0, 50)}..."`,
    type: 'social',
    priority: 'low',
    data: { likerName, postPreview }
  }),

  // System notifications
  maintenanceWarning: (hours: number): Omit<PushNotification, 'id'> => ({
    title: 'Bảo trì hệ thống',
    body: `SABO sẽ bảo trì trong ${hours} giờ. Vui lòng hoàn thành trận đấu.`,
    type: 'general',
    priority: 'high',
    data: { maintenanceHours: hours }
  }),

  rankPromotion: (newRank: string): Omit<PushNotification, 'id'> => ({
    title: 'Thăng hạng!',
    body: `Chúc mừng! Bạn đã thăng lên hạng ${newRank}`,
    type: 'general',
    priority: 'normal',
    data: { newRank }
  })
};

// Notification scheduling helper
export class NotificationScheduler {
  private notifications: Map<string, string> = new Map(); // key -> notificationId mapping

  async scheduleChallenge(challengeId: string, challengerName: string, challengeType: string) {
    const { scheduleLocalNotification } = usePushNotifications();
    
    const notificationId = await scheduleLocalNotification(
      NotificationTemplates.challengeReceived(challengerName, challengeType)
    );
    
    this.notifications.set(`challenge-${challengeId}`, notificationId);
    return notificationId;
  }

  async scheduleReminder(key: string, notification: Omit<PushNotification, 'id'>, delayMinutes: number) {
    const { scheduleLocalNotification } = usePushNotifications();
    
    const trigger = {
      seconds: delayMinutes * 60,
    };
    
    const notificationId = await scheduleLocalNotification(notification, trigger);
    this.notifications.set(key, notificationId);
    return notificationId;
  }

  async cancel(key: string) {
    const { cancelNotification } = usePushNotifications();
    const notificationId = this.notifications.get(key);
    
    if (notificationId) {
      await cancelNotification(notificationId);
      this.notifications.delete(key);
    }
  }

  async cancelAll() {
    const { cancelAllNotifications } = usePushNotifications();
    await cancelAllNotifications();
    this.notifications.clear();
  }
}

export const notificationScheduler = new NotificationScheduler();