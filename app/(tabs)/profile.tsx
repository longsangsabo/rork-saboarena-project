import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Edit3, 
  Crown,
  Star,
  TrendingUp,
  Gamepad2,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  const mockUser = {
    username: '@longsang',
    displayName: 'Anh Long Magic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rank: 'G',
    elo: 1485,
    spa: 320,
    ranking: 89,
    matches: 37
  };

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.headerButton}>
          <ArrowLeft size={24} color="#161722" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mockUser.username}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={24} color="#161722" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.gradientBorder}>
              <View style={styles.profileImageWrapper}>
                <ImageBackground
                  source={{ uri: mockUser.avatar }}
                  style={styles.profileImage}
                  imageStyle={styles.profileImageStyle}
                >
                  <View style={styles.profileOverlay}>
                    <Text style={styles.profileName}>{mockUser.displayName}</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Edit3 size={14} color="black" />
            </TouchableOpacity>
          </View>

          {/* Rank Badge */}
          <View style={styles.rankBadge}>
            <View style={styles.rankIcon}>
              <Crown size={14} color="#19127B" />
            </View>
            <Text style={styles.rankText}>RANK : {mockUser.rank}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Crown size={16} color="#081122" />
              <Text style={styles.statLabel}>ELO</Text>
              <Text style={styles.statValue}>{mockUser.elo}</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={18} color="#081122" />
              <Text style={styles.statLabel}>SPA</Text>
              <Text style={styles.statValue}>{mockUser.spa}</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={18} color="#081122" />
              <Text style={styles.statLabel}>XH</Text>
              <Text style={styles.statValue}>#{mockUser.ranking}</Text>
            </View>
            <View style={styles.statItem}>
              <Gamepad2 size={16} color="#081122" />
              <Text style={styles.statLabel}>TRẬN</Text>
              <Text style={styles.statValue}>{mockUser.matches}</Text>
            </View>
          </View>
        </View>

        {/* Tournament Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Ready</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Live</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Tournament List */}
          <View style={styles.tournamentList}>
            {tournaments.map((tournament) => (
              <View key={tournament.id} style={styles.tournamentCard}>
                <View style={styles.tournamentIcon}>
                  <Text style={styles.tournamentNumber}>8</Text>
                </View>
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <View style={styles.tournamentDetails}>
                    <Calendar size={11} color="#0A5C6D" />
                    <Text style={styles.tournamentDate}>{tournament.date}</Text>
                  </View>
                </View>
                <View style={styles.tournamentMeta}>
                  <Text style={styles.tournamentRank}>{tournament.rankRange}</Text>
                  <View style={styles.tournamentStats}>
                    <Users size={14} color="#801515" />
                    <Text style={styles.tournamentPlayers}>{tournament.players}</Text>
                    <DollarSign size={14} color="#801515" />
                    <Text style={styles.tournamentPrize}>{tournament.prize}</Text>
                  </View>
                </View>
                <View style={styles.tournamentAction}>
                  <Text style={styles.tournamentLives}>{tournament.lives}</Text>
                  <TouchableOpacity style={styles.joinButton}>
                    <View style={styles.joinIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#161722',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: -4,
    marginTop: 0,
    paddingBottom: 20,
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  gradientBorder: {
    width: 350,
    height: 350,
    borderRadius: 18,
    padding: 2,
    backgroundColor: '#7784F8',
    shadowColor: '#C695F8',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImageWrapper: {
    width: 346,
    height: 346,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 346,
    height: 346,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  profileImageStyle: {
    borderRadius: 16,
  },
  profileOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 20,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 50,
    fontWeight: '900',
    color: '#A0B2F8',
    letterSpacing: 3,
    textAlign: 'center',
  },
  editProfileButton: {
    position: 'absolute',
    right: 30,
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
    backgroundColor: 'rgba(35.89, 25.99, 91.95, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1B1B50',
    paddingHorizontal: 25,
    paddingVertical: 7,
    alignSelf: 'center',
    marginBottom: 20,
    gap: 8,
  },
  rankIcon: {
    width: 14,
    height: 14,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19127B',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 28,
    gap: 57,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#081122',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#455154',
  },
  tabsContainer: {
    backgroundColor: 'white',
    marginTop: 8,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
    paddingHorizontal: 26,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0A5C6D',
  },
  tabText: {
    fontSize: 17,
    color: '#D7D7D9',
  },
  activeTabText: {
    color: '#0A5C6D',
  },
  tournamentList: {
    padding: 20,
    gap: 16,
  },
  tournamentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.07)',
  },
  tournamentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#000',
  },
  tournamentNumber: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0A5C6D',
    marginBottom: 4,
  },
  tournamentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tournamentDate: {
    fontSize: 10,
    color: '#0A5C6D',
  },
  tournamentMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  tournamentRank: {
    fontSize: 12,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  tournamentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tournamentPlayers: {
    fontSize: 10,
    color: '#801515',
    marginRight: 8,
  },
  tournamentPrize: {
    fontSize: 10,
    color: '#801515',
  },
  tournamentAction: {
    alignItems: 'center',
  },
  tournamentLives: {
    fontSize: 10,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  joinButton: {
    width: 45,
    height: 22,
    backgroundColor: '#7F1516',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.11,
    shadowRadius: 8,
    elevation: 4,
  },
  joinIcon: {
    width: 11,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 1,
  },
});