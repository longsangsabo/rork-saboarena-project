import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { NavigationHelper } from '@/utils/NavigationHelper';
import { trpc } from '@/lib/trpc';
import {
  CustomStatusBar,
  AppHeader,
  TabNavigation,
  ProfileCard,
  RankBadge,
  ActionButtons,
  SocialActions,
  ClubInfo,
  PostContent
} from '@/components/shared';

export default function HomeScreenRefactored() {
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
      if (data.likeCount !== undefined) {
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

  const handleClubPress = () => {
    NavigationHelper.goToClub();
  };

  const tabs = [
    { key: 'nearby', label: 'Lân cận' },
    { key: 'following', label: 'Đã Follow' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=414&h=813&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Status Bar */}
        <CustomStatusBar />

        {/* Header */}
        <AppHeader showLogo />

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'nearby' | 'following')}
        />

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Profile Card */}
          <ProfileCard
            imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=297&h=292&fit=crop&crop=face"
            name="Anh Long Magic"
            size="medium"
            style={styles.profileCard}
          />

          {/* Rank Badge */}
          <RankBadge
            rank="G"
            iconType="trophy"
            style={styles.rankBadge}
          />

          {/* Action Buttons */}
          <ActionButtons
            onPlayNow={handlePlayNow}
            onSchedule={handleSchedule}
          />

          {/* Social Actions */}
          <SocialActions
            likeCount={likeCount}
            commentCount={commentCount}
            shareCount={shareCount}
            isLiked={isLiked}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            style={styles.socialActions}
          />

          {/* Club Info */}
          <ClubInfo
            avatar="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop"
            name="SABO Billiards"
            location="Vũng Tàu"
            onPress={handleClubPress}
            style={styles.clubInfo}
          />

          {/* Post Content */}
          <PostContent
            username="@longsang"
            date="03-09"
            content="Tìm đối tối nay   #sabo #rankG"
            onPress={handleProfilePress}
            style={styles.postContent}
          />
        </View>
      </ImageBackground>
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
  profileCard: {
    marginBottom: 20,
  },
  rankBadge: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  socialActions: {
    position: 'absolute',
    right: 0,
    top: 200,
  },
  clubInfo: {
    position: 'absolute',
    bottom: 120,
    left: 0,
  },
  postContent: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
});