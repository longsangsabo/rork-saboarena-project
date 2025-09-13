import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { MoreHorizontal, Users, Trophy, List } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
}

interface Match {
  id: string;
  roundNumber: string;
  player1: Player;
  player2: Player;
  score1: number;
  score2: number;
  table: string;
  status: 'Full Time' | 'In Progress' | 'Scheduled';
  handicap: string;
  raceType: string;
  isHighlighted?: boolean;
}

const mockMatches: Match[] = [
  {
    id: '1',
    roundNumber: '#1- WINNER ROUND 101',
    player1: {
      id: '1',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '2',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7'
  },
  {
    id: '2',
    roundNumber: '#2- WINNER ROUND 102',
    player1: {
      id: '3',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '4',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7'
  },
  {
    id: '3',
    roundNumber: '#3- WINNER ROUND 103',
    player1: {
      id: '5',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '6',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7'
  },
  {
    id: '4',
    roundNumber: '#4- WINNER ROUND 104',
    player1: {
      id: '7',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '8',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7'
  },
  {
    id: '9',
    roundNumber: '#9- WINNER ROUND 201',
    player1: {
      id: '9',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '10',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7'
  },
  {
    id: '22',
    roundNumber: '#22 WINNER ROUND 301',
    player1: {
      id: '11',
      name: 'C. Ramos',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    player2: {
      id: '12',
      name: 'Long Sang',
      rank: 'Rank H',
      avatar: 'https://placehold.co/50x50',
      isOnline: true
    },
    score1: 2,
    score2: 2,
    table: 'Bàn 1',
    status: 'Full Time',
    handicap: 'Hanicap 0.5 ván',
    raceType: 'Race to 7',
    isHighlighted: true
  }
];

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <View style={styles.matchContainer}>
      <Text style={styles.roundText}>{match.roundNumber}</Text>
      <View style={[styles.matchCard, match.isHighlighted && styles.highlightedCard]}>
        {/* Player 1 */}
        <View style={styles.playerSection}>
          <View style={styles.playerInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: match.player1.avatar }} style={styles.avatar} />
              {match.player1.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{match.player1.name}</Text>
              <Text style={styles.playerRank}>{match.player1.rank}</Text>
            </View>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.matchInfo}>
          <Text style={styles.statusText}>{match.status}</Text>
          <Text style={styles.scoreText}>{match.score1}    -   {match.score2}</Text>
          <Text style={styles.handicapText}>{match.handicap}</Text>
          <Text style={styles.tableText}>{match.table}</Text>
          <Text style={styles.raceText}>{match.raceType}</Text>
        </View>

        {/* Player 2 */}
        <View style={styles.playerSection}>
          <View style={styles.playerInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: match.player2.avatar }} style={styles.avatar} />
              {match.player2.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{match.player2.name}</Text>
              <Text style={styles.playerRank}>{match.player2.rank}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const BracketTabs: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'winner', label: 'Nhánh thắng', icon: Trophy },
    { id: 'loser', label: 'Nhánh thua', icon: Users },
    { id: 'elimination', label: 'Loại trực tiếp', icon: List }
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <View key={tab.id} style={styles.tabItem}>
            <IconComponent 
              size={20} 
              color={isActive ? '#0A5C6D' : '#D7D7D9'} 
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function TournamentBracketScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('winner');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Bảng đấu',
          headerRight: () => (
            <MoreHorizontal size={18} color="#161722" />
          ),
          headerStyle: {
            backgroundColor: 'white',
          },
          headerShadowVisible: true,
        }} 
      />
      
      <BracketTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.bracketContainer}>
          {/* Left Column - First Round */}
          <View style={styles.column}>
            {mockMatches.slice(0, 4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
          
          {/* Connecting Lines */}
          <View style={styles.connectingLines}>
            <View style={styles.verticalLine} />
            <View style={styles.horizontalLine} />
            <View style={styles.verticalLine} />
          </View>
          
          {/* Right Column - Advanced Rounds */}
          <View style={styles.column}>
            {mockMatches.slice(4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 17,
    fontFamily: 'ABeeZee',
    color: '#D7D7D9',
    marginTop: 4,
  },
  activeTabText: {
    color: '#0A5C6D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bracketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  connectingLines: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: '#8C8C8C',
  },
  horizontalLine: {
    width: 20,
    height: 1,
    backgroundColor: '#8C8C8C',
  },
  matchContainer: {
    marginBottom: 16,
  },
  roundText: {
    fontSize: 5.71,
    fontFamily: 'ABeeZee',
    color: '#404040',
    textTransform: 'uppercase',
    letterSpacing: 0.11,
    marginBottom: 4,
    paddingLeft: 2,
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 7.14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.86,
    elevation: 5,
    borderWidth: 0.71,
    borderColor: 'rgba(0, 0, 0, 0.07)',
  },
  highlightedCard: {
    shadowColor: '#F52626',
    shadowOpacity: 1,
    borderColor: '#F52626',
  },
  playerSection: {
    marginBottom: 8,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 0.71,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5AD439',
    borderWidth: 2,
    borderColor: 'white',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 8.57,
    fontFamily: 'ABeeZee',
    color: 'black',
    fontWeight: '400',
  },
  playerRank: {
    fontSize: 7.14,
    fontFamily: 'Inter',
    color: 'rgba(0, 0, 0, 0.50)',
    marginTop: 2,
  },
  matchInfo: {
    alignItems: 'center',
    marginVertical: 8,
  },
  statusText: {
    fontSize: 5.71,
    fontFamily: 'Poppins',
    color: '#11923D',
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 10.71,
    fontFamily: 'Poppins',
    color: '#404040',
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 4,
  },
  handicapText: {
    fontSize: 5.71,
    fontFamily: 'Inter',
    color: 'rgba(0, 0, 0, 0.50)',
    marginBottom: 2,
  },
  tableText: {
    fontSize: 10.01,
    fontFamily: 'Poppins',
    color: '#404040',
    fontWeight: '500',
    letterSpacing: 0.19,
    marginBottom: 2,
  },
  raceText: {
    fontSize: 5.71,
    fontFamily: 'Inter',
    color: 'rgba(0, 0, 0, 0.50)',
  },
});