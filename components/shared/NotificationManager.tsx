import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Bell, BellOff, Settings } from 'lucide-react-native';
import { usePushNotifications, NotificationTemplates } from '@/hooks/usePushNotifications';
import { useTheme } from '@/providers/ThemeProvider';

interface NotificationManagerProps {
  onNotificationReceived?: (notification: any) => void;
}

export function NotificationManager({ onNotificationReceived }: NotificationManagerProps) {
  const theme = useTheme();
  const {
    permissions,
    notification,
    requestPermissions,
    scheduleLocalNotification
  } = usePushNotifications();

  // Handle incoming notifications
  useEffect(() => {
    if (notification) {
      onNotificationReceived?.(notification);
      
      // Show notification details (optional - for development)
      const { title, body, data } = notification.request.content;
      
      // You can customize behavior based on notification type
      switch (data?.type) {
        case 'challenge':
          // Handle challenge notifications
          break;
        case 'tournament':
          // Handle tournament notifications
          break;
        case 'social':
          // Handle social notifications
          break;
      }
    }
  }, [notification, onNotificationReceived]);

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      Alert.alert('Thành công', 'Đã bật thông báo cho SABO Arena');
    } else {
      Alert.alert(
        'Không thể bật thông báo',
        'Vui lòng vào Settings > SABO Arena > Notifications để bật thông báo',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Mở Settings', onPress: () => {
            // Open device settings (implementation depends on platform)
          }}
        ]
      );
    }
  };

  const testNotification = async () => {
    if (permissions.granted) {
      await scheduleLocalNotification(
        NotificationTemplates.challengeReceived('Nguyễn Văn A', 'Race to 7')
      );
    } else {
      Alert.alert('Lỗi', 'Chưa cấp quyền thông báo');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colorStyle('light.surface') }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {permissions.granted ? (
            <Bell size={20} color={theme.colorStyle('sabo.primary.500')} />
          ) : (
            <BellOff size={20} color={theme.colorStyle('light.textSecondary')} />
          )}
          <Text style={[styles.title, { color: theme.colorStyle('light.text') }]}>
            Thông báo
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {/* Open notification settings */}}
        >
          <Settings size={18} color={theme.colorStyle('light.textSecondary')} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.colorStyle('light.textSecondary') }]}>
          {permissions.granted 
            ? 'Nhận thông báo về thách đấu, giải đấu và hoạt động xã hội'
            : 'Bật thông báo để không bỏ lỡ thách đấu và giải đấu thú vị'
          }
        </Text>

        {!permissions.granted && (
          <TouchableOpacity 
            style={[styles.enableButton, { backgroundColor: theme.colorStyle('sabo.primary.500') }]}
            onPress={handleRequestPermissions}
          >
            <Bell size={18} color="white" />
            <Text style={styles.enableButtonText}>
              Bật thông báo
            </Text>
          </TouchableOpacity>
        )}

        {permissions.granted && __DEV__ && (
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: theme.colorStyle('sabo.secondary.500') }]}
            onPress={testNotification}
          >
            <Text style={styles.testButtonText}>
              Test thông báo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status indicator */}
      <View style={styles.status}>
        <View style={[
          styles.statusDot,
          { backgroundColor: permissions.granted ? '#22c55e' : '#ef4444' }
        ]} />
        <Text style={[styles.statusText, { color: theme.colorStyle('light.textSecondary') }]}>
          {permissions.granted ? 'Đã bật' : 'Đã tắt'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    gap: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  enableButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  testButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
});

// Notification Integration Hook
export function useNotificationIntegration() {
  const {
    permissions,
    scheduleLocalNotification,
    cancelNotification,
  } = usePushNotifications();

  // Challenge notifications
  const notifyChallenge = async (challengerName: string, challengeType: string) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.challengeReceived(challengerName, challengeType)
    );
  };

  const notifyChallengeAccepted = async (opponentName: string) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.challengeAccepted(opponentName)
    );
  };

  const notifyChallengeReminder = async (opponentName: string, minutes: number) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.challengeStarting(opponentName, minutes),
      { seconds: Math.max(0, (minutes - 5) * 60) } // 5 minutes before
    );
  };

  // Tournament notifications
  const notifyTournament = async (tournamentName: string, minutes: number) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.tournamentStarting(tournamentName, minutes),
      { seconds: Math.max(0, (minutes - 10) * 60) } // 10 minutes before
    );
  };

  const notifyTournamentMatch = async (opponentName: string, round: string) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.tournamentMatchReady(opponentName, round)
    );
  };

  // Social notifications
  const notifyNewFollower = async (followerName: string) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.newFollower(followerName)
    );
  };

  const notifyFeedLiked = async (likerName: string, postPreview: string) => {
    if (!permissions.granted) return;
    
    return await scheduleLocalNotification(
      NotificationTemplates.feedLiked(likerName, postPreview)
    );
  };

  return {
    permissions,
    // Challenge notifications
    notifyChallenge,
    notifyChallengeAccepted,
    notifyChallengeReminder,
    // Tournament notifications
    notifyTournament,
    notifyTournamentMatch,
    // Social notifications
    notifyNewFollower,
    notifyFeedLiked,
    // Utility
    cancelNotification,
  };
}