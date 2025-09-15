import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { NavigationHelper } from '@/utils/NavigationHelper';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { CustomStatusBar } from '@/components/ui';
import { HomeHeader } from './home/components/HomeHeader';
import { TabNavigation } from '@/components/shared';
import { 
  ProfileCard,
  RankBadge,
  ActionButtons,
  SocialActions
} from '@/components/shared';
import { ClubInfo } from './home/components/ClubInfo';
import { PostContent } from './home/components/PostContent';
import { Heart, MessageCircle, Share, Users, Calendar } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock feed data
const mockFeedData = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Chưa đặt Display Name',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      rank: 'K',
      username: '@longsang'
    },
    content: {
      text: 'Tìm đối tối nay #sabo',
      backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=414&h=813&fit=crop',
      timestamp: '03-09'
    },
    stats: {
      playNow: 328700,
      schedule: 578,
      shares: 99
    },
    club: {
      name: 'SABO Billiards',
      location: 'Vũng tàu',
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=60&h=60&fit=crop',
      members: 99
    }
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Billiards Pro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      rank: 'A',
      username: '@billiardspro'
    },
    content: {
      text: 'Race to 7, ai dám không? 🔥 #challenge #rankA',
      backgroundImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=414&h=813&fit=crop',
      timestamp: '04-09'
    },
    stats: {
      playNow: 156300,
      schedule: 234,
      shares: 45
    },
    club: {
      name: 'Elite Billiards',
      location: 'TP.HCM',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop',
      members: 152
    }
  }
];

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'lancaan' | 'dafollow'>('lancaan');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const feedQuery = trpc.social.getFeed.useQuery({ 
    type: activeTab === 'nearby' ? 'nearby' : 'following' 
  });
  
  const interactMutation = trpc.social.interact.useMutation({
    onSuccess: (data) => {
      if ('likeCount' in data && data.likeCount !== undefined) {
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked || false);
      }
    }
  });

  const handleLike = () => {
    interactMutation.mutate({
      postId: '1',
      action: isLiked ? 'unlike' : 'like'
    });
  };

  const handlePlayNow = () => {
    NavigationHelper.showConfirmDialog(
      'Chơi ngay',
      'Tìm kiếm đối thủ gần bạn?',
      () => NavigationHelper.goToChallenges()
    );
  };

  const handleSchedule = () => {
    NavigationHelper.showConfirmDialog(
      'Lên lịch',
      'Đặt lịch chơi cho sau?',
      () => console.log('Schedule match')
    );
  };

  const handleComment = () => {
    NavigationHelper.showFeatureComingSoon('bình luận');
  };

  const handleShare = () => {
    interactMutation.mutate({
      postId: '1',
      action: 'share'
    });
    NavigationHelper.showSuccessMessage('Đã chia sẻ thành công!');
  };

  const handleProfilePress = () => {
    NavigationHelper.goToProfile();
  };

  const handleComponentDemo = () => {
    router.push('/component-demo');
  };

  const handleClubPress = () => {
    NavigationHelper.goToClub();
  };







  return (
    <View style={[styles.container, { backgroundColor: theme.colorStyle('dark.background') }]}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=414&h=813&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Status Bar */}
        <CustomStatusBar />

        {/* Header */}
        <HomeHeader 
          onWeatherPress={() => console.log('Weather')}
          onMessagesPress={() => console.log('Messages')}
          onNotificationsPress={() => console.log('Notifications')}
        />

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'nearby' | 'following')}
          tabs={[
            { key: 'nearby', label: 'Lân cận' },
            { key: 'following', label: 'Đã Follow' }
          ]}
        />

        {/* Main Content */}
        <View style={[styles.mainContent, { 
          paddingHorizontal: theme.spacingStyle(5),
          paddingTop: theme.spacingStyle(5)
        }]}>
          {/* Profile Card */}
          <ProfileCard 
            imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=297&h=292&fit=crop&crop=face"
            name="Anh Long Magic"
          />

          {/* Rank Badge */}
          <RankBadge rank="G" />

          {/* Action Buttons */}
          <ActionButtons 
            onPlayNow={handlePlayNow}
            onSchedule={handleSchedule}
          />

          {/* Social Actions */}
          <SocialActions 
            isLiked={isLiked}
            likeCount={likeCount}
            commentCount={commentCount}
            shareCount={shareCount}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            style={[styles.socialActions, {
              right: theme.spacingStyle(5), // 20px
              top: 200 // Custom positioning - no exact spacing token for 200px
            }]}
          />

          {/* Club Info */}
          <ClubInfo 
            name="SABO Billiards"
            location="Vũng Tàu"
            avatar="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop"
            isOnline={true}
            onPress={handleClubPress}
            style={[styles.clubInfo, {
              bottom: 120, // Custom positioning - no exact spacing token
              left: theme.spacingStyle(5) // 20px
            }]}
          />

          {/* Post Content */}
          <PostContent 
            username="longsang"
            date="03-09"
            content="Tìm đối tối nay   #sabo #rankG"
            onPress={handleProfilePress}
            style={[styles.postContent, {
              bottom: theme.spacingStyle(10), // 40px
              left: theme.spacingStyle(5), // 20px
              right: theme.spacingStyle(5) // 20px
            }]}
          />
        </View>
      </ImageBackground>
      
      {/* Demo Button */}
      <TouchableOpacity
        style={[styles.demoButton, {
          bottom: theme.spacingStyle(7), // 28px close to 30px
          right: theme.spacingStyle(5), // 20px
          backgroundColor: theme.colorStyle('sabo.secondary.500'), // Purple/Gold accent
          paddingHorizontal: theme.spacingStyle(4), // 16px
          paddingVertical: theme.spacingStyle(3), // 12px
          borderRadius: 25 // Custom rounded pill shape
        }]}
        onPress={handleComponentDemo}
      >
        <Text style={[styles.demoButtonText, {
          color: theme.colorStyle('light.card'), // white
          ...theme.fontStyle('buttonMedium') // fontSize: 14, fontWeight: 'semibold'
        }]}>🎨 Demo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor dynamically set in component
  },
  backgroundImage: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    // paddingHorizontal, paddingTop dynamically set in component
  },
  socialActions: {
    position: 'absolute',
    // right, top dynamically set in component  
  },
  clubInfo: {
    position: 'absolute',
    // bottom, left dynamically set in component
  },
  postContent: {
    position: 'absolute',
    // bottom, left, right dynamically set in component
  },
  demoButton: {
    position: 'absolute',
    // Dynamic positioning, backgroundColor, padding, borderRadius set in component
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  demoButtonText: {
    // Dynamic color, fontSize, fontWeight set in component
  },
});