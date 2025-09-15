import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Text,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { spacing } from '@/lib/design-tokens/src/spacing';
import { useResponsive, getAvatarSize, getCardPadding, getHeaderPadding, responsiveFontSize } from '@/utils/responsive';
import { RankBadge } from '@/components/shared';
import { CustomStatusBar, MenuButton, LoadingState, EmptyState } from '@/components/ui';
import { 
  UserAvatar, 
  ProfileTag, 
  StatsGrid, 
  ProfileTabs 
} from '@/components/profile';
import { TournamentListItem } from '@/components/tournaments';

export default function ProfileScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'tournaments' | 'challenges'>('tournaments');
  
  // Use responsive utilities
  const responsive = useResponsive();
  const avatarSize = getAvatarSize();
  const headerPadding = getHeaderPadding();
  const cardPadding = getCardPadding();
  
  // Responsive font sizes
  const titleFontSize = responsiveFontSize(16);
  const bodyFontSize = responsiveFontSize(12);
  const smallFontSize = responsiveFontSize(10);
  
  // TRPC queries for real data
  const profileQuery = trpc.user.getProfile.useQuery({ userId: '1' });
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: 'registration_open',
    limit: 10
  });
  
  // Mock data matching screenshot
  const user = profileQuery.data || {
    id: "1",
    username: "username",
    displayName: "Chưa đặt Display Name",
    avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop",
    rank: "K",
    elo: 1485,
    spa: 320,
    ranking: 89,
    matches: 37,
  };

  // Tournament data matching screenshot
  const tournaments = [
    {
      id: '1',
      number: '8',
      title: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      participants: '0/16',
      prize: '10 Mỗi',
      matches: '2 Mang',
      location: 'K - I+'
    },
    {
      id: '2',
      number: '8', 
      title: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      participants: '0/16', 
      prize: '10 Mỗi',
      matches: '2 Mang',
      location: 'K - I+'
    },
    {
      id: '3',
      number: '8',
      title: 'SABO POOL 8 BALL', 
      date: '07/09 - Thứ 7',
      participants: '0/16',
      prize: '10 Mỗi', 
      matches: '2 Mang',
      location: 'K - I+'
    }
  ];

  const statsData = [
    { label: 'ELO', value: user.elo },
    { label: 'SPA', value: user.spa },
    { label: 'XH', value: `#${user.ranking}` },
    { label: 'TRẬN', value: user.matches },
  ];

  if (profileQuery.isLoading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: theme.colors.light.background }
    ]}>
      <CustomStatusBar />
      
      {/* Header */}
      <View style={[
        styles.header,
        { 
          backgroundColor: theme.colors.light.background,
          paddingHorizontal: headerPadding,
          paddingVertical: responsive.isSmallScreen ? 10 : 12
        }
      ]}>
        <ProfileTag username={user.username} />
        <MenuButton onPress={() => console.log('Menu pressed')} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Avatar */}
        <View style={[styles.avatarSection, { paddingVertical: responsive.isSmallScreen ? 20 : 24 }]}>
          <UserAvatar 
            imageUrl={user.avatar}
            size={avatarSize}
            showEditButton={true}
            onEditPress={() => console.log('Edit avatar')}
          />
        </View>

        {/* Display Name */}
        <View style={[
          styles.nameSection, 
          { marginBottom: responsive.isSmallScreen ? 12 : 16 }
        ]}>
          <Text style={[
            styles.displayName,
            { 
              color: theme.colors.sabo.gray[600],
              fontSize: titleFontSize
            }
          ]}>
            {user.displayName}
          </Text>
        </View>

        {/* Rank Badge */}
        <View style={[
          styles.rankSection,
          { marginBottom: responsive.isSmallScreen ? 20 : 24 }
        ]}>
          <View style={[
            styles.rankBadge,
            { 
              backgroundColor: theme.colors.sabo.secondary[500],
              paddingHorizontal: responsive.isSmallScreen ? 16 : 20,
              paddingVertical: responsive.isSmallScreen ? 6 : 8
            }
          ]}>
            <Text style={[
              styles.rankText,
              { 
                color: 'white',
                fontSize: responsiveFontSize(14)
              }
            ]}>
              RANK: {user.rank}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <StatsGrid 
          stats={statsData} 
          style={[
            styles.statsSection,
            { marginBottom: responsive.isSmallScreen ? 20 : 24 }
          ]}
          isSmallScreen={responsive.isSmallScreen}
        />

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabsSection}
        />

        {/* Tournament List */}
        <View style={[
          styles.tournamentList,
          { paddingHorizontal: headerPadding }
        ]}>
          {tournaments.map((tournament) => (
            <View key={tournament.id} style={[
              styles.tournamentItem,
              { 
                backgroundColor: theme.colors.light.card,
                padding: cardPadding,
                marginBottom: responsive.isSmallScreen ? 10 : 12
              }
            ]}>
              <View style={styles.tournamentRow}>
                <View style={[
                  styles.tournamentNumber,
                  { backgroundColor: theme.colors.sabo.primary[100] }
                ]}>
                  <Text style={[
                    styles.tournamentNumberText,
                    { color: theme.colors.sabo.primary[600] }
                  ]}>
                    {tournament.number}
                  </Text>
                </View>
                
                <View style={styles.tournamentInfo}>
                  <Text style={[
                    styles.tournamentTitle,
                    { 
                      color: theme.colors.sabo.primary[600],
                      fontSize: titleFontSize
                    }
                  ]}>
                    {tournament.title}
                  </Text>
                  
                  <View style={[
                    styles.tournamentDetails,
                    { gap: responsive.isSmallScreen ? 8 : 12 }
                  ]}>
                    <Text style={[
                      styles.tournamentDate,
                      { 
                        color: theme.colors.sabo.gray[500],
                        fontSize: bodyFontSize
                      }
                    ]}>
                      📅 {tournament.date}
                    </Text>
                    <Text style={[
                      styles.tournamentParticipants,
                      { 
                        color: theme.colors.sabo.error[500],
                        fontSize: bodyFontSize
                      }
                    ]}>
                      👥 {tournament.participants}
                    </Text>
                    <Text style={[
                      styles.tournamentPrize,
                      { 
                        color: theme.colors.sabo.success[500],
                        fontSize: bodyFontSize
                      }
                    ]}>
                      💰 {tournament.prize}
                    </Text>
                    <Text style={[
                      styles.tournamentMatches,
                      { 
                        color: theme.colors.sabo.gray[600],
                        fontSize: bodyFontSize
                      }
                    ]}>
                      {tournament.matches}
                    </Text>
                  </View>
                </View>
                
                <Text style={[
                  styles.tournamentLocation,
                  { 
                    color: theme.colors.sabo.gray[500],
                    fontSize: responsiveFontSize(14)
                  }
                ]}>
                  {tournament.location}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    // Dynamic padding applied inline
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    // Dynamic padding applied inline
  },
  nameSection: {
    alignItems: 'center',
    // Dynamic margin applied inline
  },
  displayName: {
    fontWeight: '500',
    // Dynamic fontSize applied inline
  },
  rankSection: {
    alignItems: 'center',
    // Dynamic margin applied inline
  },
  rankBadge: {
    borderRadius: 20,
    // Dynamic padding applied inline
  },
  rankText: {
    fontWeight: 'bold',
    // Dynamic fontSize applied inline
  },
  statsSection: {
    // Dynamic margin applied inline
  },
  tabsSection: {
    marginBottom: 0,
  },
  tournamentList: {
    // Dynamic padding applied inline
  },
  tournamentItem: {
    borderRadius: 12,
    // Dynamic padding and margin applied inline
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tournamentNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontWeight: '600',
    marginBottom: 8,
    // Dynamic fontSize applied inline
  },
  tournamentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Dynamic gap applied inline
  },
  tournamentDate: {
    // Dynamic fontSize applied inline
  },
  tournamentParticipants: {
    // Dynamic fontSize applied inline
  },
  tournamentPrize: {
    // Dynamic fontSize applied inline
  },
  tournamentMatches: {
    // Dynamic fontSize applied inline
  },
  tournamentLocation: {
    fontWeight: '500',
    marginLeft: 8,
    // Dynamic fontSize applied inline
  },
});