import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { MapPin, MoreHorizontal, Camera } from 'lucide-react-native';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Anh Long Magic',
    rank: 'G',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    joinDate: '04/09/2025'
  },
  {
    id: '2',
    name: 'SABO',
    rank: 'H',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    joinDate: '04/09/2025'
  }
];

export default function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: '@sabobilliards',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '400',
            color: '#161722'
          },
          headerLeft: () => (
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.backIcon} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MoreHorizontal size={18} color="#161722" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                source={{ uri: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop' }}
                style={styles.clubImage}
              />
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.80)']}
                style={styles.imageOverlay}
              >
                <Text style={styles.clubName}>SABO Billiards</Text>
              </LinearGradient>
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationBadge}>
            <MapPin size={12} color="#BA1900" />
            <Text style={styles.locationText}>601A Nguyễn An Ninh - TP Vũng Tàu</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>Thành viên</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Giải đấu</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89.9 Tr</Text>
            <Text style={styles.statLabel}>Prize Pool</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>37</Text>
            <Text style={styles.statLabel}>Thách đấu</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <View style={styles.tabIcon} />
            <Text style={[styles.tabText, styles.activeTabText]}>Thành viên</Text>
            <View style={styles.activeTabIndicator} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <View style={styles.tabIcon} />
            <Text style={styles.tabText}>Giải đấu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <View style={styles.tabIcon} />
            <Text style={styles.tabText}>Thách đấu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <View style={styles.tabIcon} />
            <Text style={styles.tabText}>Hồ sơ</Text>
          </TouchableOpacity>
        </View>

        {/* Members List */}
        <View style={styles.membersContainer}>
          {mockMembers.map((member) => (
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
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  membersContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
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