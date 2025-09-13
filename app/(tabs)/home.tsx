import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Trophy,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  Zap,
  Sun,
  MessageSquare,
} from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'nearby' | 'following'>('nearby');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(328700);
  const [commentCount] = useState(578);
  const [shareCount] = useState(99);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };







  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=414&h=813&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Status Bar */}
        <View style={[styles.statusBar, { paddingTop: insets.top }]}>
          <Text style={styles.timeText}>9:41</Text>
          <View style={styles.statusIcons} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.saboTitle}>SABO</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Sun size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <MessageSquare size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Bell size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
            onPress={() => setActiveTab('nearby')}
          >
            <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>Lân cận</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onPress={() => setActiveTab('following')}
          >
            <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Đã Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=297&h=292&fit=crop&crop=face' }}
                style={styles.profileImage}
              />
              <View style={styles.profileOverlay}>
                <Text style={styles.profileName}>Anh Long Magic</Text>
              </View>
            </View>
          </View>

          {/* Rank Badge */}
          <View style={styles.rankBadge}>
            <Trophy size={14} color="#19127B" />
            <Text style={styles.rankText}>RANK : G</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Zap size={18} color="#FF004F" />
              </View>
              <Text style={styles.actionText}>Chơi luôn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Calendar size={18} color="#FF004F" />
              </View>
              <Text style={styles.actionText}>Lên lịch</Text>
            </TouchableOpacity>
          </View>

          {/* Social Actions */}
          <View style={styles.socialActions}>
            <TouchableOpacity style={styles.socialAction} onPress={handleLike}>
              <Heart 
                size={35} 
                color={isLiked ? "#FF004F" : "white"} 
                fill={isLiked ? "#FF004F" : "transparent"}
              />
              <Text style={styles.socialCount}>{formatCount(likeCount)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialAction}>
              <MessageCircle size={35} color="white" />
              <Text style={styles.socialCount}>{commentCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialAction}>
              <MessageSquare size={35} color="white" />
              <Text style={styles.socialCount}>{shareCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialAction}>
              <Share size={35} color="white" />
              <Text style={styles.socialCount}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Club Info */}
          <View style={styles.clubInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop' }}
              style={styles.clubAvatar}
            />
            <View style={styles.clubOnlineIndicator} />
            <View style={styles.clubDetails}>
              <Text style={styles.clubName}>SABO Billiards</Text>
              <View style={styles.clubLocation}>
                <Text style={styles.clubLocationText}>Vũng Tàu</Text>
              </View>
            </View>
          </View>

          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={styles.postUser}>@longsang · 03-09</Text>
            <Text style={styles.postText}>Tìm đối tối nay   #sabo #rankG</Text>
          </View>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
  },
  statusIcons: {
    width: 18,
    height: 6.5,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  saboTitle: {
    color: '#6503C8',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#D7D7D9',
    fontSize: 16,
    fontFamily: 'Lexend Exa',
    fontWeight: '700',
    opacity: 0.8,
  },
  activeTabText: {
    color: 'white',
    opacity: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 299,
    height: 294,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileName: {
    color: '#A0B2F8',
    fontSize: 40,
    fontFamily: 'Alumni Sans',
    fontWeight: '900',
    lineHeight: 36,
    letterSpacing: 3,
    textAlign: 'center',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35.89, 25.99, 91.95, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1B1B50',
    paddingHorizontal: 25,
    paddingVertical: 7,
    marginBottom: 20,
    gap: 8,
  },
  rankText: {
    color: '#19127B',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '600',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  socialActions: {
    position: 'absolute',
    right: 20,
    top: 200,
    alignItems: 'center',
    gap: 20,
  },
  socialAction: {
    alignItems: 'center',
    gap: 4,
  },
  socialCount: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  clubInfo: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clubAvatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 0.83,
    borderColor: '#161616',
  },
  clubOnlineIndicator: {
    position: 'absolute',
    left: 34,
    top: 41,
    width: 20,
    height: 20,
    backgroundColor: '#FF004F',
    borderRadius: 10,
  },
  clubDetails: {
    flex: 1,
  },
  clubName: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Aldrich',
    fontWeight: '400',
    marginBottom: 4,
  },
  clubLocation: {
    backgroundColor: '#0A5C6D',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  clubLocationText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
  },
  postContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  postUser: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    marginBottom: 4,
  },
  postText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    lineHeight: 19.5,
  },
});