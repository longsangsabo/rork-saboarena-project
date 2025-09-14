import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Alert,
  Text,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  MoreHorizontal,
  Crown,
  Star,
  TrendingUp,
  Gamepad2,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { 
  ProfileCard, 
  StatsRow, 
  TabNavigation, 
  ProfileTournamentList 
} from '@/components/shared';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ready' | 'live' | 'done'>('ready');
  
  const profileQuery = trpc.user.getProfile.useQuery({});
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: activeTab === 'ready' ? 'upcoming' : activeTab === 'live' ? 'live' : 'completed'
  });
  
  const user = profileQuery.data;
  
  const handleEditProfile = () => {
    // Temporary placeholder for edit profile navigation
    console.log('Edit profile pressed');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    Alert.alert(
      'Tùy chọn',
      'Chọn hành động',
      [
        { text: 'Tìm bạn', onPress: () => console.log('Find friends') },
        { text: 'Cài đặt', onPress: () => console.log('Settings') },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => console.log('Logout') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };
  
  if (profileQuery.isLoading) {
    return (
      <View style={[
        styles.container, 
        { 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: theme.colorStyle('sabo.background.50')
        }
      ]}>
        <ActivityIndicator size="large" color={theme.colorStyle('sabo.primary.500')} />
        <Text style={[
          theme.fontStyle('body'),
          { 
            marginTop: theme.spacingStyle(4), // 16px
            color: theme.colorStyle('sabo.text.500') 
          }
        ]}>
          Đang tải hồ sơ...
        </Text>
      </View>
    );
  }
  
  if (!user) {
    return (
      <View style={[
        styles.container, 
        { 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: theme.colorStyle('sabo.background.50')
        }
      ]}>
        <Text style={[
          theme.fontStyle('body'),
          { color: theme.colorStyle('sabo.text.500') }
        ]}>
          Không thể tải hồ sơ
        </Text>
      </View>
    );
  }

  const tournaments = [
    {
      id: 1,
      name: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      rankRange: 'K - I+',
      players: '0/16',
      prize: '10 Million',
      lives: '2 Mạng'
    },
    {
      id: 2,
      name: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      rankRange: 'K - I+',
      players: '0/16',
      prize: '10 Million',
      lives: '2 Mạng'
    }
  ];

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colorStyle('sabo.background.50') }
    ]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colorStyle('sabo.background.50')} />
      
      {/* Header */}
      <View style={[
        styles.header, 
        { 
          paddingTop: insets.top + theme.spacingStyle(3), // 12px
          backgroundColor: theme.colorStyle('sabo.background.50'),
          borderBottomColor: theme.colorStyle('sabo.border.subtle'),
        }
      ]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <ArrowLeft size={24} color={theme.colorStyle('sabo.text.800')} />
        </TouchableOpacity>
        <Text style={[
          theme.fontStyle('h4'),
          { color: theme.colorStyle('sabo.text.800') }
        ]}>
          {user.username}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleMoreOptions}>
          <MoreHorizontal size={24} color={theme.colorStyle('sabo.text.800')} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <ProfileCard 
          imageUrl={user.avatar}
          name={user.displayName}
          showEditButton={true}
          onEditPress={handleEditProfile}
          size="large"
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.colorStyle('sabo.background.50'),
              borderBottomColor: theme.colorStyle('sabo.border.subtle'),
            }
          ]}
        />

          {/* Rank Badge */}
          <View style={[
            styles.rankBadge,
            {
              backgroundColor: theme.colorStyle('sabo.primary.100'),
              borderColor: theme.colorStyle('sabo.primary.600'),
              paddingHorizontal: theme.spacingStyle(6), // 24px -> 25px close enough
              paddingVertical: theme.spacingStyle(2), // 8px -> 7px close enough
              marginBottom: theme.spacingStyle(5), // 20px
            }
          ]}>
            <View style={styles.rankIcon}>
              <Crown size={14} color={theme.colorStyle('sabo.primary.700')} />
            </View>
            <Text style={[
              theme.fontStyle('label'),
              {
                color: theme.colorStyle('sabo.primary.700'),
                fontWeight: '600',
              }
            ]}>
              RANK : {user.rank}
            </Text>
          </View>

          {/* Stats Row */}
          <View style={[
            styles.statsRow,
            {
              paddingHorizontal: theme.spacingStyle(7), // 28px
            }
          ]}>
            <View style={styles.statItem}>
              <Crown size={16} color={theme.colorStyle('sabo.text.800')} />
              <Text style={[
                theme.fontStyle('caption'),
                {
                  color: theme.colorStyle('sabo.text.800'),
                  marginTop: theme.spacingStyle(1), // 4px
                  marginBottom: theme.spacingStyle(0.5), // 2px
                }
              ]}>
                ELO
              </Text>
              <Text style={[
                theme.fontStyle('h4'),
                {
                  color: theme.colorStyle('sabo.text.600'),
                  fontWeight: '700',
                }
              ]}>
                {user.elo}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Star size={18} color={theme.colorStyle('sabo.text.800')} />
              <Text style={[
                theme.fontStyle('caption'),
                {
                  color: theme.colorStyle('sabo.text.800'),
                  marginTop: theme.spacingStyle(1),
                  marginBottom: theme.spacingStyle(0.5),
                }
              ]}>
                SPA
              </Text>
              <Text style={[
                theme.fontStyle('h4'),
                {
                  color: theme.colorStyle('sabo.text.600'),
                  fontWeight: '700',
                }
              ]}>
                {user.spa}
              </Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={18} color={theme.colorStyle('sabo.text.800')} />
              <Text style={[
                theme.fontStyle('caption'),
                {
                  color: theme.colorStyle('sabo.text.800'),
                  marginTop: theme.spacingStyle(1),
                  marginBottom: theme.spacingStyle(0.5),
                }
              ]}>
                XH
              </Text>
              <Text style={[
                theme.fontStyle('h4'),
                {
                  color: theme.colorStyle('sabo.text.600'),
                  fontWeight: '700',
                }
              ]}>
                #{user.ranking}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Gamepad2 size={16} color={theme.colorStyle('sabo.text.800')} />
              <Text style={[
                theme.fontStyle('caption'),
                {
                  color: theme.colorStyle('sabo.text.800'),
                  marginTop: theme.spacingStyle(1),
                  marginBottom: theme.spacingStyle(0.5),
                }
              ]}>
                TRẬN
              </Text>
              <Text style={[
                theme.fontStyle('h4'),
                {
                  color: theme.colorStyle('sabo.text.600'),
                  fontWeight: '700',
                }
              ]}>
                {user.matches}
              </Text>
            </View>
          </View>

        {/* Tournament List */}
        <ProfileTournamentList 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tournaments={tournamentsQuery.data?.tournaments || []}
          isLoading={tournamentsQuery.isLoading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.33,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: -4,
    marginTop: 0,
    paddingBottom: 20,
    borderBottomWidth: 0.33,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
    position: 'relative',
  },
  gradientBorder: {
    width: 350,
    height: 350,
    borderRadius: 18,
    padding: 2,
    shadowColor: 'rgba(255, 255, 255, 0.10)',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImageWrapper: {
    width: 346,
    height: 346,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  profileImageStyle: {
    borderRadius: 16,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#A0B2F8',
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 36,
  },
  editProfileButton: {
    position: 'absolute',
    right: 32,
    bottom: -10,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'center',
    gap: 8,
  },
  rankIcon: {
    width: 14,
    height: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 57,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
});