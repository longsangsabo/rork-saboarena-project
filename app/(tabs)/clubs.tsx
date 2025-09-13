import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { MapPin, MoreHorizontal, Camera } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}



export default function ClubsScreen() {
  const [mainTab, setMainTab] = useState<'clb' | 'discover'>('clb');
  const [activeTab, setActiveTab] = useState<'members' | 'tournaments' | 'challenges' | 'profile'>('members');
  
  const clubsQuery = trpc.clubs.list.useQuery({ limit: 10 });
  const membersQuery = trpc.clubs.getMembers.useQuery({ clubId: '1' });
  
  const clubs = clubsQuery.data?.clubs || [];
  const club = clubs[0];
  const members = membersQuery.data?.members || [];
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    Alert.alert(
      'Tùy chọn',
      'Chọn hành động',
      [
        { text: 'Thiết lập club', onPress: () => console.log('Club settings') },
        { text: 'Rời khỏi club', style: 'destructive', onPress: () => console.log('Leave club') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };
  
  const handleCameraPress = () => {
    Alert.alert('Thay đổi ảnh', 'Tính năng thay đổi ảnh sẽ có sớm!');
  };
  
  if (clubsQuery.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0A5C6D" />
        <Text style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin club...</Text>
      </View>
    );
  }
  
  if (!club) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Không thể tải thông tin club</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '900',
            color: '#6503C8',
            letterSpacing: 1.2
          },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.headerIconButton}>
                <View style={styles.notificationIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconButton}>
                <View style={styles.chatIcon} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {/* Main Tab Navigation */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'clb' && styles.activeMainTab]}
          onPress={() => setMainTab('clb')}
        >
          <Text style={[styles.mainTabText, mainTab === 'clb' && styles.activeMainTabText]}>CLB</Text>
          {mainTab === 'clb' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'discover' && styles.activeMainTab]}
          onPress={() => setMainTab('discover')}
        >
          <Text style={[styles.mainTabText, mainTab === 'discover' && styles.activeMainTabText]}>Khám phá</Text>
          {mainTab === 'discover' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mainTab === 'discover' ? (
          // Discover Tab Content
          <View style={styles.discoverContainer}>
            {clubsQuery.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A5C6D" />
                <Text style={styles.loadingText}>Đang tải danh sách club...</Text>
              </View>
            ) : (
              clubs.map((clubItem, index) => (
                <View key={clubItem.id} style={styles.clubCard}>
                  <Image source={{ uri: clubItem.cover_image }} style={styles.clubCardImage} />
                  <View style={styles.clubCardContent}>
                    <Text style={styles.clubCardName}>{clubItem.name}</Text>
                    <View style={styles.clubCardLocation}>
                      <MapPin size={12} color="#BA1900" />
                      <Text style={styles.clubCardLocationText}>{clubItem.location}</Text>
                    </View>
                    <View style={styles.clubCardActions}>
                      <TouchableOpacity style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>Tham gia</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Đăng ký hạng</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          // CLB Tab Content
          <View>
            {/* Club Avatar Section */}
            <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(119, 132, 248, 0.40)', 'rgba(27, 26, 38, 0.20)', 'rgba(198, 149, 248, 0.40)']}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <Image 
                source={{ uri: club.cover_image }}
                style={styles.clubImage}
              />
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.80)']}
                style={styles.imageOverlay}
              >
                <Text style={styles.clubName}>{club.name}</Text>
              </LinearGradient>
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Camera size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationBadge}>
            <MapPin size={12} color="#BA1900" />
            <Text style={styles.locationText}>{club.location}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.member_count}</Text>
            <Text style={styles.statLabel}>Thành viên</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.tournament_count}</Text>
            <Text style={styles.statLabel}>Giải đấu</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{(club.prize_pool / 1000000).toFixed(1)} Tr</Text>
            <Text style={styles.statLabel}>Prize Pool</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.challenge_count}</Text>
            <Text style={styles.statLabel}>Thách đấu</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <View style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>Thành viên</Text>
            {activeTab === 'members' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
            onPress={() => setActiveTab('tournaments')}
          >
            <View style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>Giải đấu</Text>
            {activeTab === 'tournaments' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
            onPress={() => setActiveTab('challenges')}
          >
            <View style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>Thách đấu</Text>
            {activeTab === 'challenges' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <View style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Hồ sơ</Text>
            {activeTab === 'profile' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.contentContainer}>
          {activeTab === 'members' && (
            <View style={styles.membersContainer}>
              {membersQuery.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#0A5C6D" />
                  <Text style={styles.loadingText}>Đang tải danh sách thành viên...</Text>
                </View>
              ) : members.length > 0 ? (
                members.map((member) => (
                  <TouchableOpacity key={member.id} style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                      <View style={styles.avatarWrapper}>
                        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                        <View style={[styles.onlineIndicator, { backgroundColor: member.isOnline ? '#5AD439' : '#86878B' }]} />
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRank}>Rank {member.rank}</Text>
                      </View>
                    </View>
                    <Text style={styles.joinDate}>{member.joinDate}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Chưa có thành viên nào</Text>
                </View>
              )}
            </View>
          )}
          
          {activeTab === 'tournaments' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Danh sách giải đấu sẽ có sớm</Text>
            </View>
          )}
          
          {activeTab === 'challenges' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Danh sách thách đấu sẽ có sớm</Text>
            </View>
          )}
          
          {activeTab === 'profile' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Thông tin chi tiết club sẽ có sớm</Text>
            </View>
          )}
        </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'black',
  },
  chatIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'black',
  },
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  mainTab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  activeMainTab: {
    // Active styling handled by indicator
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#CCCCCE',
  },
  activeMainTabText: {
    color: 'black',
    fontWeight: '700',
  },
  mainTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#6503C8',
  },
  discoverContainer: {
    padding: 16,
  },
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubCardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clubCardContent: {
    padding: 16,
  },
  clubCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  clubCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  clubCardLocationText: {
    fontSize: 14,
    color: '#666',
  },
  clubCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#0A5C6D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#BA1900',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  backIcon: {
    width: 22.46,
    height: 22,
    backgroundColor: '#161722',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
  },
  gradientBorder: {
    width: 350,
    height: 350,
    borderRadius: 18,
    padding: 2,
  },
  clubImage: {
    width: 346,
    height: 346,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 76,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  clubName: {
    color: '#A0B2F8',
    fontSize: 50,
    fontWeight: '900',
    lineHeight: 36,
    letterSpacing: 3,
    textAlign: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 27,
    bottom: 8,
    width: 52,
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30.07, 23.83, 117.45, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    gap: 8,
  },
  locationText: {
    color: '#081122',
    fontSize: 16,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 46,
    paddingVertical: 20,
    gap: 35,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#455154',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
  },
  statLabel: {
    color: '#081122',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.33,
    borderTopColor: '#D0D1D3',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabIcon: {
    width: 20,
    height: 19.37,
    backgroundColor: '#D7D7D9',
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#D7D7D9',
    letterSpacing: 0.15,
  },
  activeTabText: {
    color: '#211A2C',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 48,
    height: 2,
    backgroundColor: '#161722',
  },
  contentContainer: {
    flex: 1,
  },
  membersContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  memberAvatar: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    borderWidth: 1,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    color: 'black',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 2,
  },
  memberRank: {
    color: 'rgba(0, 0, 0, 0.50)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  joinDate: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'right',
  },
});