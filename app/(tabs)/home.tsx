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
import { CustomStatusBar } from '@/components/shared/StatusBar';
import { HomeHeader } from '@/components/shared/HomeHeader';
import { TabNavigation } from '@/components/shared/TabNavigation';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { RankBadge } from '@/components/shared/RankBadge';
import { ActionButtons } from '@/components/shared/ActionButtons';
import { SocialActions } from '@/components/shared/SocialActions';
import { ClubInfo } from '@/components/shared/ClubInfo';
import { PostContent } from '@/components/shared/PostContent';

export default function HomeScreen() {
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
    <View style={styles.container}>
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
        <View style={styles.mainContent}>
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
            style={styles.socialActions}
          />

          {/* Club Info */}
          <ClubInfo 
            name="SABO Billiards"
            location="Vũng Tàu"
            avatar="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop"
            isOnline={true}
            onPress={handleClubPress}
            style={styles.clubInfo}
          />

          {/* Post Content */}
          <PostContent 
            username="longsang"
            date="03-09"
            content="Tìm đối tối nay   #sabo #rankG"
            onPress={handleProfilePress}
            style={styles.postContent}
          />
        </View>
      </ImageBackground>
      
      {/* Demo Button */}
      <TouchableOpacity
        style={styles.demoButton}
        onPress={handleComponentDemo}
      >
        <Text style={styles.demoButtonText}>🎨 Demo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  socialActions: {
    position: 'absolute',
    right: 20,
    top: 200,
  },
  clubInfo: {
    position: 'absolute',
    bottom: 120,
    left: 20,
  },
  postContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  demoButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6503C8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});