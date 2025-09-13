import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share, Calendar, Zap } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState<'giaoluu' | 'thachdau'>('giaoluu');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=414&h=813&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Status Bar */}
      <View style={[styles.statusBar, { paddingTop: insets.top + 13 }]}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.statusIcons} />
      </View>
      
      {/* Header with SABO logo and icons */}
      <View style={styles.header}>
        <Text style={styles.logoText}>SABO</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconPlaceholder} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MessageCircle size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconPlaceholder} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'giaoluu' && styles.activeTab]}
          onPress={() => setActiveTab('giaoluu')}
        >
          <Text style={[styles.tabText, activeTab === 'giaoluu' && styles.activeTabText]}>Giao lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'thachdau' && styles.activeTab]}
          onPress={() => setActiveTab('thachdau')}
        >
          <Text style={[styles.tabText, activeTab === 'thachdau' && styles.activeTabText]}>Thách đấu</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Profile Card */}
        <View style={styles.profileCardContainer}>
          <LinearGradient
            colors={['rgba(119, 132, 248, 0.40)', 'rgba(27, 26, 38, 0.20)', 'rgba(198, 149, 248, 0.40)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
              style={styles.profileOverlay}
            >
              <Text style={styles.profileName}>Anh Long Magic</Text>
            </LinearGradient>
          </LinearGradient>
        </View>
        
        {/* Rank Badge */}
        <View style={styles.rankBadge}>
          <View style={styles.rankIcon} />
          <Text style={styles.rankText}>RANK : G</Text>
        </View>
        
        {/* Small Avatar */}
        <View style={styles.smallAvatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=47&h=47&fit=crop&crop=face' }}
            style={styles.smallAvatar}
          />
          <View style={styles.onlineIndicator} />
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playNowButton}>
          <Zap size={18} color="#FF004F" />
          <Text style={styles.playNowText}>Chơi luôn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.scheduleButton}>
          <Calendar size={18} color="#FF004F" />
          <Text style={styles.scheduleText}>Lên lịch</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop' }}
            style={styles.userAvatar}
          />
          <View style={styles.userOnlineIndicator} />
          <View style={styles.userDetails}>
            <Text style={styles.clubName}>SABO Billiards</Text>
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>Vũng Tàu</Text>
            </View>
          </View>
        </View>
        
        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postHeader}>@longsang · 03-09</Text>
          <Text style={styles.postText}>Tìm đối tối nay   #sabo #rankG</Text>
        </View>
        
        {/* Interaction Stats */}
        <View style={styles.interactionStats}>
          <View style={styles.statItem}>
            <Heart size={24} color="white" fill="white" />
            <Text style={styles.statText}>328.7K</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={24} color="white" />
            <Text style={styles.statText}>578</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.commentIcon} />
            <Text style={styles.statText}>99</Text>
          </View>
          <View style={styles.statItem}>
            <Share size={24} color="white" />
            <Text style={styles.statText}>Share</Text>
          </View>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, { backgroundColor: '#CCCCCC' }]} />
          <Text style={[styles.navText, { color: '#CCCCCC' }]}>Trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, { backgroundColor: '#FF004F' }]} />
          <Text style={[styles.navText, { color: '#FF004F' }]}>Tìm đối</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.tournamentIcon}>
            <Text style={styles.tournamentText}>8</Text>
          </View>
          <Text style={styles.navText}>Giải đấu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, { backgroundColor: 'white' }]} />
          <Text style={styles.navText}>Club</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, { backgroundColor: 'white' }]} />
          <Text style={styles.navText}>Hồ sơ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 13,
    height: 44,
  },
  timeText: {
    color: 'white',
    fontSize: 15,
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
    height: 34,
  },
  logoText: {
    color: '#6503C8',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 26,
  },
  iconButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 13,
    height: 44,
  },
  tab: {
    marginRight: 60,
  },
  activeTab: {},
  tabText: {
    color: '#CCCCCE',
    fontSize: 16,
    fontWeight: '400',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  mainContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  profileCardContainer: {
    width: 299,
    height: 294,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileGradient: {
    flex: 1,
    padding: 2,
    borderRadius: 18,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 56,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  profileName: {
    color: '#A0B2F8',
    fontSize: 40,
    fontWeight: '900',
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
    marginTop: 20,
    gap: 8,
  },
  rankIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#19127B',
  },
  rankText: {
    color: '#19127B',
    fontSize: 16,
    fontWeight: '600',
  },
  smallAvatarContainer: {
    position: 'absolute',
    right: 20,
    top: 320,
  },
  smallAvatar: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    borderWidth: 1,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -5,
    right: 5,
    width: 20,
    height: 20,
    backgroundColor: '#FF004F',
    borderRadius: 10,
  },
  actionButtons: {
    position: 'absolute',
    left: 11,
    top: 540,
    gap: 20,
  },
  playNowButton: {
    alignItems: 'center',
    gap: 5,
  },
  playNowText: {
    color: 'white',
    fontSize: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  scheduleButton: {
    alignItems: 'center',
    gap: 5,
  },
  scheduleText: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 0.83,
    borderColor: '#161616',
  },
  userOnlineIndicator: {
    position: 'absolute',
    left: 17,
    top: 41,
    width: 20,
    height: 20,
    backgroundColor: '#FF004F',
    borderRadius: 10,
  },
  userDetails: {
    marginLeft: 16,
  },
  clubName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
  },
  locationBadge: {
    backgroundColor: '#0A5C6D',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  postContent: {
    marginBottom: 20,
  },
  postHeader: {
    color: 'white',
    fontSize: 17,
    marginBottom: 4,
  },
  postText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 19.5,
  },
  interactionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 40,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: 'white',
    fontSize: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  commentIcon: {
    width: 35,
    height: 35,
    backgroundColor: 'white',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 83,
    backgroundColor: 'black',
    borderTopWidth: 0.33,
    borderTopColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 7,
  },
  navItem: {
    alignItems: 'center',
    gap: 5,
  },
  navIcon: {
    width: 23,
    height: 21,
  },
  navText: {
    color: 'white',
    fontSize: 10,
    letterSpacing: 0.15,
  },
  tournamentIcon: {
    width: 36,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentText: {
    color: 'black',
    fontSize: 8,
  },
});