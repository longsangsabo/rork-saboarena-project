import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
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

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'nearby' | 'following'>('nearby');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(328700);
  const [commentCount] = useState(578);
  const [shareCount] = useState(99);

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
    <View style={[styles.container, { backgroundColor: theme.colorStyle('light.background') }]}>
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
          paddingHorizontal: theme.spacingStyle('xl'),
          paddingTop: theme.spacingStyle('xl')
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
              right: theme.spacingStyle('xl'), // 20px
              top: 200 // Custom positioning - no exact spacing token for 200px
            }]}
          />

          {/* Club Info */}
          <ClubInfo 
            name="SABO Billiards"
            location="Vũng Tàu"
            avatarUrl="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop"
            onPress={handleClubPress}
          />

          {/* Post Content */}
          <PostContent 
            user="longsang"
            date="03-09"
            text="Tìm đối tối nay   #sabo #rankG"
            onPress={handleProfilePress}
          />
        </View>
      </ImageBackground>
      
      {/* Demo Button */}
      <TouchableOpacity
        style={[styles.demoButton, {
          bottom: theme.spacingStyle('3xl'), // 32px close to 30px
          right: theme.spacingStyle('xl'), // 20px
          backgroundColor: theme.colorStyle('sabo.secondary.500'), // Purple/Gold accent
          paddingHorizontal: theme.spacingStyle('lg'), // 16px
          paddingVertical: theme.spacingStyle('md'), // 12px
          borderRadius: 25 // Custom rounded pill shape
        }]}
        onPress={handleComponentDemo}
      >
        <Text style={[styles.demoButtonText, {
          color: theme.colorStyle('light.card'), // white
          ...theme.fontStyle('buttonSmall') // fontSize: 14, fontWeight: 'semibold'
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