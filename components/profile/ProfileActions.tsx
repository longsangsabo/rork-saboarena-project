import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserPlus, MessageCircle, MoreHorizontal, Star } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { trpc } from '@/lib/trpc';

interface ProfileActionsProps {
  userId: string;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onMessage?: () => void;
  onChallenge?: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  userId,
  isOwnProfile = false,
  isFollowing = false,
  onMessage,
  onChallenge
}) => {
  const theme = useTheme();
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      // This would call a follow/unfollow API
      setFollowing(!following);
      Alert.alert(
        'Thành công', 
        following ? 'Đã bỏ theo dõi' : 'Đã theo dõi'
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thực hiện thao tác này');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    Alert.alert('Tin nhắn', 'Tính năng nhắn tin sẽ sớm được ra mắt!');
    onMessage?.();
  };

  const handleChallenge = () => {
    Alert.alert('Thách đấu', 'Bạn có muốn gửi lời thách đấu không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Gửi thách đấu', onPress: () => onChallenge?.() }
    ]);
  };

  const handleMore = () => {
    Alert.alert('Tùy chọn', 'Chọn thao tác', [
      { text: 'Báo cáo', style: 'destructive' },
      { text: 'Chặn người dùng', style: 'destructive' },
      { text: 'Hủy', style: 'cancel' }
    ]);
  };

  if (isOwnProfile) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.primaryButton,
            { backgroundColor: theme.colors.sabo.primary[500] }
          ]}
          onPress={() => Alert.alert('Thông báo', 'Chỉnh sửa hồ sơ')}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>
            Chỉnh sửa hồ sơ  
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          following ? styles.followingButton : styles.followButton,
          {
            backgroundColor: following 
              ? theme.colors.sabo.gray[200] 
              : theme.colors.sabo.primary[500]
          }
        ]}
        onPress={handleFollow}
        disabled={loading}
      >
        <UserPlus 
          size={16} 
          color={following ? theme.colors.sabo.gray[600] : 'white'} 
        />
        <Text style={[
          styles.buttonText,
          {
            color: following 
              ? theme.colors.sabo.gray[600] 
              : 'white'
          }
        ]}>
          {following ? 'Đang theo dõi' : 'Theo dõi'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.messageButton,
          { backgroundColor: theme.colors.sabo.blue[500] }
        ]}
        onPress={handleMessage}
      >
        <MessageCircle size={16} color="white" />
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Nhắn tin
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.challengeButton,
          { backgroundColor: theme.colors.sabo.orange[500] }
        ]}
        onPress={handleChallenge}
      >
        <Star size={16} color="white" />
        <Text style={[styles.buttonText, { color: 'white' }]}>
          Thách đấu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: theme.colors.sabo.gray[200] }
        ]}
        onPress={handleMore}
      >
        <MoreHorizontal 
          size={16} 
          color={theme.colors.sabo.gray[600]} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  iconButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  primaryButton: {
    // Already styled above
  },
  followButton: {
    // Already styled above
  },
  followingButton: {
    // Already styled above
  },
  messageButton: {
    // Already styled above
  },
  challengeButton: {
    // Already styled above
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});