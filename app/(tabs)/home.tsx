import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Clock, Share, MessageCircle, Users } from 'lucide-react-native';

import { useTheme } from '@/providers/ThemeProvider';
import { AppHeader } from '@/components/layout';
import { TabNavigation } from '@/components/shared';
import { RankBadge } from '@/components/shared';

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
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Shark Player',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
      rank: 'S',
      username: '@sharkplayer'
    },
    content: {
      text: 'Thử thách rank S 🎱 Có ai dám không? 💪',
      backgroundImage: 'https://images.unsplash.com/photo-1626875643468-21dc9b5fb97b?w=414&h=813&fit=crop',
      timestamp: '05-09'
    },
    stats: {
      playNow: 89200,
      schedule: 167,
      shares: 23
    },
    club: {
      name: 'Pro Club',
      location: 'Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=60&h=60&fit=crop',
      members: 234
    }
  }
];

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'lancaan' | 'dafollow'>('lancaan');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const screenHeight = Dimensions.get('window').height;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / screenHeight);
    setCurrentIndex(index);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.colorStyle('dark.background') }]}>
        {/* Fixed Header Overlay */}
        <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
          <AppHeader
            title="Tìm đối"
            onWeatherPress={() => {}}
            onMessagesPress={() => {}}
            onNotificationsPress={() => {}}
          />
          
          <View style={styles.tabContainer}>
            <TabNavigation
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as 'lancaan' | 'dafollow')}
              tabs={[
                { key: 'lancaan', label: 'Lân cận' },
                { key: 'dafollow', label: 'Đã follow' }
              ]}
            />
          </View>
        </View>

        {/* Vertical Feed ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {mockFeedData.map((item, index) => (
            <View key={item.id} style={[styles.feedItem, { height: screenHeight }]}>
              <ImageBackground
                source={{ uri: item.content.backgroundImage }}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  {/* Main Content Area */}
                  <View style={styles.contentWrapper}>
                    {/* Left Side - Profile & Content */}
                    <View style={styles.leftContent}>
                      {/* Profile Info */}
                      <View style={styles.profileInfo}>
                        <Image 
                          source={{ uri: item.user.avatar }}
                          style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                          <Text style={[styles.displayName, { color: theme.colorStyle('light.text') }]}>
                            {item.user.name}
                          </Text>
                          <Text style={[styles.username, { color: theme.colorStyle('light.textSecondary') }]}>
                            {item.user.username}
                          </Text>
                          <View style={styles.metaInfo}>
                            <RankBadge rank={item.user.rank} />
                            <Text style={[styles.timestamp, { color: theme.colorStyle('light.textSecondary') }]}>
                              {item.content.timestamp}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Post Content */}
                      <Text style={[styles.postText, { color: theme.colorStyle('light.text') }]}>
                        {item.content.text}
                      </Text>

                      {/* Club Info */}
                      <View style={styles.clubInfo}>
                        <Image 
                          source={{ uri: item.club.avatar }}
                          style={styles.clubAvatar}
                        />
                        <View>
                          <Text style={[styles.clubName, { color: theme.colorStyle('light.text') }]}>
                            {item.club.name}
                          </Text>
                          <Text style={[styles.clubLocation, { color: theme.colorStyle('light.textSecondary') }]}>
                            {item.club.location} • {item.club.members} thành viên
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right Side - Actions */}
                    <View style={styles.rightActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: theme.colorStyle('sabo.primary.500') }]}>
                          <Users size={24} color="white" />
                        </View>
                        <Text style={[styles.actionCount, { color: theme.colorStyle('light.text') }]}>
                          {formatCount(item.stats.playNow)}
                        </Text>
                        <Text style={[styles.actionLabel, { color: theme.colorStyle('light.textSecondary') }]}>
                          Chơi ngay
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: theme.colorStyle('sabo.secondary.500') }]}>
                          <Clock size={24} color="white" />
                        </View>
                        <Text style={[styles.actionCount, { color: theme.colorStyle('light.text') }]}>
                          {formatCount(item.stats.schedule)}
                        </Text>
                        <Text style={[styles.actionLabel, { color: theme.colorStyle('light.textSecondary') }]}>
                          Hẹn lịch
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                          <Share size={24} color="white" />
                        </View>
                        <Text style={[styles.actionCount, { color: theme.colorStyle('light.text') }]}>
                          {formatCount(item.stats.shares)}
                        </Text>
                        <Text style={[styles.actionLabel, { color: theme.colorStyle('light.textSecondary') }]}>
                          Chia sẻ
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                          <MessageCircle size={24} color="white" />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.colorStyle('light.textSecondary') }]}>
                          Nhắn tin
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* Feed Indicator */}
        <View style={[styles.feedIndicator, { bottom: insets.bottom + 20 }]}>
          {mockFeedData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                { 
                  backgroundColor: theme.colorStyle('light.text'),
                  opacity: currentIndex === index ? 1 : 0.3 
                }
              ]}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  feedItem: {
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 120, // Space for header
  },
  leftContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  postText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  clubAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  clubName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  clubLocation: {
    fontSize: 12,
  },
  rightActions: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  feedIndicator: {
    position: 'absolute',
    right: 20,
    flexDirection: 'column',
    gap: 8,
  },
  indicatorDot: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
});