import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { MapPin, MoreHorizontal, Camera, Trophy, Users, Target, BarChart3, X } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { 
  UniversalTabs,
  ClubCard, 
  MemberList, 
  LoadingContainer, 
  ErrorContainer,
  TournamentCard,
  RankingCard
} from '@/components/shared';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { mockChallenges, getChallengesByStatus } from '@/demo-data/challenges-data';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}



export default function ClubsScreen() {
  const theme = useTheme();
  const [mainTab, setMainTab] = useState<'clb' | 'find_opponent'>('clb');
  const [activeTab, setActiveTab] = useState<'members' | 'tournaments' | 'ranking' | 'challenges'>('members');
  const [tournamentTab, setTournamentTab] = useState<'ready' | 'live' | 'done'>('ready');
  const [rankingTab, setRankingTab] = useState<'prizepool' | 'elo' | 'spa'>('prizepool');
  const [challengeTab, setChallengeTab] = useState<'waiting' | 'live' | 'finished'>('waiting');

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const handleChallengeTabChange = (tabKey: string) => {
    setChallengeTab(tabKey as 'waiting' | 'live' | 'finished');
  };
  
  // TRPC queries for real data
  const clubsQuery = trpc.clubs.list.useQuery({ limit: 10 });
  const membersQuery = trpc.clubs.getMembers.useQuery({ clubId: '1' });
  
  // Use real data or fallback to mock data
  const mockClub = {
    id: "1",
    name: "SABO Billiards",
    location: "Vũng Tàu",
    memberCount: 24,
    member_count: 24,
    tournament_count: 12,
    prize_pool: 5500000,
    challenge_count: 8,
    avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop",
    cover_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
  };
  
  const clubs = [mockClub];
  // Use real data or fallback to mock data
  const club = clubsQuery.data?.clubs?.[0] || mockClub;
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
          Đang tải thông tin club...
        </Text>
      </View>
    );
  }
  
  if (!club) {
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
          Không thể tải thông tin club
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colorStyle('sabo.background.50') }
    ]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: theme.colorStyle('sabo.background.50'),
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '900',
            color: theme.colorStyle('sabo.primary.600'),
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
      <View style={[
        styles.mainTabContainer,
        {
          backgroundColor: theme.colorStyle('sabo.background.50'),
          paddingHorizontal: theme.spacingStyle(5), // 20px
          borderBottomColor: theme.colorStyle('sabo.border.light'),
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.mainTab,
            {
              paddingVertical: theme.spacingStyle(4), // 16px
              paddingHorizontal: theme.spacingStyle(5), // 20px
            }
          ]}
          onPress={() => setMainTab('clb')}
        >
          <Text style={[
            theme.fontStyle('body'),
            {
              color: mainTab === 'clb' 
                ? theme.colorStyle('sabo.text.900') 
                : theme.colorStyle('sabo.text.300'),
              fontWeight: mainTab === 'clb' ? '700' : '400',
            }
          ]}>
            CLB
          </Text>
          {mainTab === 'clb' && (
            <View style={[
              styles.mainTabIndicator,
              { backgroundColor: theme.colorStyle('sabo.primary.600') }
            ]} />
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.mainTab,
            {
              paddingVertical: theme.spacingStyle(4), // 16px
              paddingHorizontal: theme.spacingStyle(5), // 20px
            }
          ]}
          onPress={() => setMainTab('find_opponent')}
        >
          <Text style={[
            theme.fontStyle('body'),
            {
              color: mainTab === 'find_opponent' 
                ? theme.colorStyle('sabo.text.900') 
                : theme.colorStyle('sabo.text.300'),
              fontWeight: mainTab === 'find_opponent' ? '700' : '400',
            }
          ]}>
            Tìm đối
          </Text>
          {mainTab === 'find_opponent' && (
            <View style={[
              styles.mainTabIndicator,
              { backgroundColor: theme.colorStyle('sabo.primary.600') }
            ]} />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mainTab === 'find_opponent' ? (
          // Find Opponent Tab Content
          <View style={styles.findOpponentContainer}>
            {clubsQuery.isLoading ? (
              <View style={[
                styles.loadingContainer,
                { paddingVertical: theme.spacingStyle(10) } // 40px
              ]}>
                <ActivityIndicator size="large" color={theme.colorStyle('sabo.primary.500')} />
                <Text style={[
                  theme.fontStyle('bodySmall'),
                  { color: theme.colorStyle('sabo.text.500') }
                ]}>
                  Đang tải danh sách club...
                </Text>
              </View>
            ) : (
              clubs.map((clubItem: any) => (
                <ClubCard
                  key={clubItem.id}
                  id={clubItem.id}
                  name={clubItem.name}
                  location={clubItem.location}
                  memberCount={clubItem.member_count || 0}
                  imageUrl={clubItem.cover_image}
                  onPress={() => console.log('Club pressed:', clubItem.name)}
                />
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
                <Text style={[
                  styles.clubName,
                  {
                    color: theme.colorStyle('sabo.primary.200'),
                    fontSize: 50, // Keep large size for club name impact
                    letterSpacing: 3,
                  }
                ]}>
                  {club.name}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Camera size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={[
          styles.locationContainer,
          {
            paddingHorizontal: theme.spacingStyle(5), // 20px
            marginBottom: theme.spacingStyle(5), // 20px
          }
        ]}>
          <View style={[
            styles.locationBadge,
            {
              backgroundColor: theme.colorStyle('sabo.primary.50'),
              paddingHorizontal: theme.spacingStyle(4), // 16px
              paddingVertical: theme.spacingStyle(2), // 8px
            }
          ]}>
            <MapPin size={12} color={theme.colorStyle('sabo.error.600')} />
            <Text style={[
              theme.fontStyle('body'),
              { color: theme.colorStyle('sabo.text.800') }
            ]}>
              {club.location}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={[
          styles.statsContainer,
          {
            paddingHorizontal: theme.spacingStyle(11), // ~46px
            paddingVertical: theme.spacingStyle(5), // 20px
          }
        ]}>
          <View style={styles.statItem}>
            <Text style={[
              theme.fontStyle('h4'),
              {
                color: theme.colorStyle('sabo.text.600'),
                fontWeight: '700',
              }
            ]}>
              {club.member_count}
            </Text>
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: theme.colorStyle('sabo.text.800'),
                marginTop: theme.spacingStyle(1), // 4px
              }
            ]}>
              Thành viên
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              theme.fontStyle('h4'),
              {
                color: theme.colorStyle('sabo.text.600'),
                fontWeight: '700',
              }
            ]}>
              {club.tournament_count}
            </Text>
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: theme.colorStyle('sabo.text.800'),
                marginTop: theme.spacingStyle(1),
              }
            ]}>
              Giải đấu
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              theme.fontStyle('h4'),
              {
                color: theme.colorStyle('sabo.text.600'),
                fontWeight: '700',
              }
            ]}>
              {(club.prize_pool / 1000000).toFixed(1)} Tr
            </Text>
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: theme.colorStyle('sabo.text.800'),
                marginTop: theme.spacingStyle(1),
              }
            ]}>
              Prize Pool
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              theme.fontStyle('h4'),
              {
                color: theme.colorStyle('sabo.text.600'),
                fontWeight: '700',
              }
            ]}>
              {club.challenge_count}
            </Text>
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: theme.colorStyle('sabo.text.800'),
                marginTop: theme.spacingStyle(1),
              }
            ]}>
              Thách đấu
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[
          styles.tabContainer,
          {
            backgroundColor: theme.colorStyle('sabo.background.50'),
            borderTopColor: theme.colorStyle('sabo.border.subtle'),
            paddingVertical: theme.spacingStyle(2), // 8px
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.tab,
              { paddingVertical: theme.spacingStyle(1.5) } // ~5px
            ]}
            onPress={() => setActiveTab('members')}
          >
            <Users 
              size={20} 
              color={activeTab === 'members' 
                ? theme.colorStyle('sabo.text.800') 
                : theme.colorStyle('sabo.text.300')
              } 
            />
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: activeTab === 'members' 
                  ? theme.colorStyle('sabo.text.700') 
                  : theme.colorStyle('sabo.text.300'),
                letterSpacing: 0.15,
              }
            ]}>
              Thành viên
            </Text>
            {activeTab === 'members' && (
              <View style={[
                styles.activeTabIndicator,
                { backgroundColor: theme.colorStyle('sabo.text.800') }
              ]} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab,
              { paddingVertical: theme.spacingStyle(1.5) }
            ]}
            onPress={() => setActiveTab('tournaments')}
          >
            <Trophy 
              size={20} 
              color={activeTab === 'tournaments' 
                ? theme.colorStyle('sabo.text.800') 
                : theme.colorStyle('sabo.text.300')
              } 
            />
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: activeTab === 'tournaments' 
                  ? theme.colorStyle('sabo.text.700') 
                  : theme.colorStyle('sabo.text.300'),
                letterSpacing: 0.15,
              }
            ]}>
              Giải đấu
            </Text>
            {activeTab === 'tournaments' && (
              <View style={[
                styles.activeTabIndicator,
                { backgroundColor: theme.colorStyle('sabo.text.800') }
              ]} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab,
              { paddingVertical: theme.spacingStyle(1.5) }
            ]}
            onPress={() => setActiveTab('ranking')}
          >
            <BarChart3 
              size={20} 
              color={activeTab === 'ranking' 
                ? theme.colorStyle('sabo.text.800') 
                : theme.colorStyle('sabo.text.300')
              } 
            />
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: activeTab === 'ranking' 
                  ? theme.colorStyle('sabo.text.700') 
                  : theme.colorStyle('sabo.text.300'),
                letterSpacing: 0.15,
              }
            ]}>
              Bảng xếp hạng
            </Text>
            {activeTab === 'ranking' && (
              <View style={[
                styles.activeTabIndicator,
                { backgroundColor: theme.colorStyle('sabo.text.800') }
              ]} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab,
              { paddingVertical: theme.spacingStyle(1.5) }
            ]}
            onPress={() => setActiveTab('challenges')}
          >
            <Target 
              size={20} 
              color={activeTab === 'challenges' 
                ? theme.colorStyle('sabo.text.800') 
                : theme.colorStyle('sabo.text.300')
              } 
            />
            <Text style={[
              theme.fontStyle('caption'),
              {
                color: activeTab === 'challenges' 
                  ? theme.colorStyle('sabo.text.700') 
                  : theme.colorStyle('sabo.text.300'),
                letterSpacing: 0.15,
              }
            ]}>
              Thách đấu
            </Text>
            {activeTab === 'challenges' && (
              <View style={[
                styles.activeTabIndicator,
                { backgroundColor: theme.colorStyle('sabo.text.800') }
              ]} />
            )}
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.contentContainer}>
          {activeTab === 'members' && (
            <View style={styles.membersContainer}>
              <MemberList 
                members={members}
                loading={membersQuery.isLoading}
              />
            </View>
          )}
          
          {activeTab === 'tournaments' && (
            <View style={styles.tournamentsContainer}>
              {/* Tournament Sub-tabs */}
              <View style={[
                styles.subTabContainer,
                {
                  backgroundColor: theme.colorStyle('sabo.background.50'),
                  borderBottomColor: theme.colorStyle('sabo.border.light'),
                  paddingHorizontal: theme.spacingStyle(5), // 20px
                }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3), // 12px
                      paddingHorizontal: theme.spacingStyle(4), // 16px
                    }
                  ]}
                  onPress={() => setTournamentTab('ready')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: tournamentTab === 'ready' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: tournamentTab === 'ready' ? '600' : '400',
                    }
                  ]}>
                    Ready
                  </Text>
                  {tournamentTab === 'ready' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3),
                      paddingHorizontal: theme.spacingStyle(4),
                    }
                  ]}
                  onPress={() => setTournamentTab('live')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: tournamentTab === 'live' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: tournamentTab === 'live' ? '600' : '400',
                    }
                  ]}>
                    Live
                  </Text>
                  {tournamentTab === 'live' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3),
                      paddingHorizontal: theme.spacingStyle(4),
                    }
                  ]}
                  onPress={() => setTournamentTab('done')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: tournamentTab === 'done' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: tournamentTab === 'done' ? '600' : '400',
                    }
                  ]}>
                    Done
                  </Text>
                  {tournamentTab === 'done' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Tournament Content */}
              <ScrollView style={styles.tournamentsList} showsVerticalScrollIndicator={false}>
                {tournamentTab === 'ready' && (
                  <View style={styles.tournamentContent}>
                    <TournamentCard 
                      tournament={{
                        id: 'demo-1',
                        title: 'SABO POOL 8 BALL Championship',
                        prize_pool: 10000000,
                        entry_fee: 100000,
                        current_players: 8,
                        max_players: 16,
                        min_rank: 'K',
                        max_rank: 'H+',
                        location: 'Club SABO Arena',
                        start_time: '2024-09-08T10:00:00Z',
                        end_time: '2024-09-08T18:00:00Z',
                        status: 'upcoming'
                      }}
                    />
                  </View>
                )}
                {tournamentTab === 'live' && (
                  <View style={[
                    styles.emptyContainer,
                    { paddingVertical: theme.spacingStyle(14) } // ~60px
                  ]}>
                    <Text style={[
                      theme.fontStyle('body'),
                      { 
                        color: theme.colorStyle('sabo.text.500'),
                        textAlign: 'center',
                      }
                    ]}>
                      Không có giải đấu nào đang diễn ra
                    </Text>
                  </View>
                )}
                {tournamentTab === 'done' && (
                  <View style={[
                    styles.emptyContainer,
                    { paddingVertical: theme.spacingStyle(14) } // ~60px
                  ]}>
                    <Text style={[
                      theme.fontStyle('body'),
                      { 
                        color: theme.colorStyle('sabo.text.500'),
                        textAlign: 'center',
                      }
                    ]}>
                      Chưa có giải đấu nào kết thúc
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          
          {activeTab === 'ranking' && (
            <View style={styles.rankingContainer}>
              {/* Ranking Sub-tabs */}
              <View style={[
                styles.subTabContainer,
                {
                  backgroundColor: theme.colorStyle('sabo.background.50'),
                  borderBottomColor: theme.colorStyle('sabo.border.light'),
                  paddingHorizontal: theme.spacingStyle(5), // 20px
                }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3), // 12px
                      paddingHorizontal: theme.spacingStyle(4), // 16px
                    }
                  ]}
                  onPress={() => setRankingTab('prizepool')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: rankingTab === 'prizepool' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: rankingTab === 'prizepool' ? '600' : '400',
                    }
                  ]}>
                    Prize Pool
                  </Text>
                  {rankingTab === 'prizepool' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3),
                      paddingHorizontal: theme.spacingStyle(4),
                    }
                  ]}
                  onPress={() => setRankingTab('elo')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: rankingTab === 'elo' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: rankingTab === 'elo' ? '600' : '400',
                    }
                  ]}>
                    ELO
                  </Text>
                  {rankingTab === 'elo' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.subTab,
                    {
                      paddingVertical: theme.spacingStyle(3),
                      paddingHorizontal: theme.spacingStyle(4),
                    }
                  ]}
                  onPress={() => setRankingTab('spa')}
                >
                  <Text style={[
                    theme.fontStyle('bodySmall'),
                    {
                      color: rankingTab === 'spa' 
                        ? theme.colorStyle('sabo.primary.600') 
                        : theme.colorStyle('sabo.text.400'),
                      fontWeight: rankingTab === 'spa' ? '600' : '400',
                    }
                  ]}>
                    SPA
                  </Text>
                  {rankingTab === 'spa' && (
                    <View style={[
                      styles.subTabIndicator,
                      { backgroundColor: theme.colorStyle('sabo.primary.600') }
                    ]} />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Ranking Content */}
              <ScrollView style={styles.rankingList} showsVerticalScrollIndicator={false}>
                {[
                  { id: '1', rank: 'A+', name: 'Player 1', value: rankingTab === 'prizepool' ? '5.000.000' : rankingTab === 'elo' ? '1500' : '1000', avatar: 'https://placehold.co/40x40', position: 1 },
                  { id: '2', rank: 'A', name: 'Player 2', value: rankingTab === 'prizepool' ? '3.000.000' : rankingTab === 'elo' ? '1400' : '800', avatar: 'https://placehold.co/40x40', position: 2 },
                  { id: '3', rank: 'B+', name: 'Player 3', value: rankingTab === 'prizepool' ? '2.000.000' : rankingTab === 'elo' ? '1300' : '600', avatar: 'https://placehold.co/40x40', position: 3 },
                ].map((user) => (
                  <RankingCard 
                    key={user.id}
                    user={user}
                    type={rankingTab}
                    isTopRank={user.position === 1}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          
          {activeTab === 'challenges' && (
            <View style={styles.challengesContainer}>
              <UniversalTabs 
                tabs={challengeTabs}
                activeTab={challengeTab}
                onTabChange={handleChallengeTabChange}
                variant="underline"
              />
              <ScrollView 
                style={styles.challengesList}
                showsVerticalScrollIndicator={false}
              >
                {getChallengesByStatus(challengeTab)
                  .map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      onJoin={() => console.log('Join challenge:', challenge.id)}
                      onCancel={() => console.log('Cancel challenge:', challenge.id)}
                      onViewLive={() => console.log('View live:', challenge.id)}
                    />
                  ))
                }
                {getChallengesByStatus(challengeTab).length === 0 && (
                  <View style={[
                    styles.emptyContainer,
                    { paddingVertical: theme.spacingStyle(14) } // ~60px
                  ]}>
                    <Text style={[
                      theme.fontStyle('body'),
                      { 
                        color: theme.colorStyle('sabo.text.500'),
                        textAlign: 'center',
                      }
                    ]}>
                      {challengeTab === 'waiting' && 'Chưa có thách đấu nào đang chờ'}
                      {challengeTab === 'live' && 'Không có trận đấu nào đang diễn ra'}
                      {challengeTab === 'finished' && 'Chưa có trận đấu nào kết thúc'}
                    </Text>
                  </View>
                )}
              </ScrollView>
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
    borderBottomWidth: 1,
  },
  mainTab: {
    position: 'relative',
  },
  mainTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
  },
  findOpponentContainer: {
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
  challengesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  challengesList: {
    flex: 1,
    paddingTop: 8,
  },
  tournamentsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
  },
  subTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeSubTab: {
    // Active styling handled by indicator
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
  activeSubTabText: {
    color: '#0A5C6D',
    fontWeight: '600',
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#0A5C6D',
  },
  tournamentsList: {
    flex: 1,
    paddingTop: 16,
  },
  tournamentContent: {
    paddingHorizontal: 16,
  },
  rankingList: {
    flex: 1,
    paddingTop: 16,
  },
});