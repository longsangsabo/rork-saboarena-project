import React, { useState, useRef, useEffect } from 'react';
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
import { trpc } from '@/lib/trpc';
import { FeedItem } from '@/components/home/FeedItem';
import { useRealTimeFeed } from '@/lib/hooks/useWebSocket';

// Mock feed data (fallback for when API is not ready)
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
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [allFeedData, setAllFeedData] = useState<any[]>([]);

  // TRPC queries for real data with pagination
  const feedQuery = trpc.social?.getFeed?.useQuery({ 
    type: activeTab,
    limit: 10,
    page: page
  }) || { data: null, isLoading: false, error: null };

  const challengesQuery = trpc.challenges?.list?.useQuery({
    status: 'waiting',
    limit: 5
  }) || { data: null, isLoading: false, error: null };

  // Real-time WebSocket connection
  const { 
    isConnected: wsConnected, 
    feedUpdates, 
    clearUpdates 
  } = useRealTimeFeed();

  // Use real data or fallback to mock data
  const baseFeedData = feedQuery.data?.posts || mockFeedData;
  
  // Update all feed data when new data arrives
  useEffect(() => {
    if (feedQuery.data?.posts) {
      if (page === 1) {
        // First load or refresh
        setAllFeedData(feedQuery.data.posts);
      } else {
        // Load more - append to existing data
        setAllFeedData(prev => [...prev, ...feedQuery.data.posts]);
      }
      setIsLoadingMore(false);
      
      // Check if there's more data
      if (feedQuery.data.posts.length < 10) {
        setHasMoreData(false);
      }
    }
  }, [feedQuery.data, page]);

  // Merge real-time updates with accumulated data
  const feedData = feedUpdates.length > 0 
    ? [...feedUpdates, ...allFeedData]
    : allFeedData.length > 0 ? allFeedData : baseFeedData;

  const screenHeight = Dimensions.get('window').height;

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const offsetY = contentOffset.y;
    const index = Math.floor(offsetY / screenHeight);
    setCurrentIndex(index);

    // Check if user is near the end (within 2 screens)
    const distanceFromEnd = contentSize.height - (offsetY + layoutMeasurement.height);
    if (distanceFromEnd < screenHeight * 2) {
      handleLoadMore();
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && !feedQuery.isLoading) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMoreData(true);
    setAllFeedData([]);
    feedQuery.refetch();
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
          
          {/* WebSocket Status Indicator */}
          <View style={[styles.wsStatus, { 
            backgroundColor: wsConnected ? '#10B981' : '#EF4444',
            opacity: wsConnected ? 0.8 : 0.6
          }]}>
            <View style={[styles.wsIndicator, {
              backgroundColor: wsConnected ? '#34D399' : '#F87171'
            }]} />
            <Text style={styles.wsText}>
              {wsConnected ? 'Live' : 'Offline'}
            </Text>
          </View>
          
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
          {feedQuery.isLoading ? (
            <View style={[styles.feedItem, { height: screenHeight, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[styles.loadingText, { color: theme.colorStyle('light.text') }]}>
                Đang tải feed...
              </Text>
            </View>
          ) : feedQuery.error ? (
            <View style={[styles.feedItem, { height: screenHeight, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[styles.errorText, { color: theme.colorStyle('light.text') }]}>
                Không thể tải feed. Sử dụng dữ liệu demo.
              </Text>
            </View>
          ) : (
            feedData.map((item, index) => (
              <FeedItem
                key={item.id}
                item={item}
                screenHeight={screenHeight}
                formatCount={formatCount}
              />
            ))
          )}
          
          {/* Loading More Indicator */}
          {isLoadingMore && (
            <View style={[styles.feedItem, { height: screenHeight, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[styles.loadingText, { color: theme.colorStyle('light.text') }]}>
                Đang tải thêm...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Feed Indicator */}
        <View style={[styles.feedIndicator, { bottom: insets.bottom + 20 }]}>
          {feedData.map((_, index) => (
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
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  connectionStatus: {
    position: 'absolute',
    top: 100,
    right: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});