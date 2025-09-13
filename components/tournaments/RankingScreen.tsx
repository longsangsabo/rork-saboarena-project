import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MoreHorizontal,
  Trophy,
  TrendingUp,
  TrendingDown,
  Crown,
  Swords
} from 'lucide-react-native';

interface RankingScreenProps {
  onBack: () => void;
}

interface RankingPlayer {
  id: string;
  name: string;
  rank: string;
  prizePool: number;
  avatar: string;
  position: number;
  trend: 'up' | 'down' | 'same';
  isOnline: boolean;
}

const mockRankingData: RankingPlayer[] = [
  {
    id: '1',
    name: 'Anh Long Magic',
    rank: 'G',
    prizePool: 89500000,
    avatar: 'https://placehold.co/100x100',
    position: 1,
    trend: 'same',
    isOnline: true
  },
  {
    id: '2',
    name: 'Paul C. Ramos',
    rank: 'H',
    prizePool: 50000000,
    avatar: 'https://placehold.co/100x100',
    position: 2,
    trend: 'up',
    isOnline: true
  },
  {
    id: '3',
    name: 'C. Ramos',
    rank: 'H',
    prizePool: 40000000,
    avatar: 'https://placehold.co/100x100',
    position: 3,
    trend: 'down',
    isOnline: true
  },
  {
    id: '4',
    name: 'Paul C. Ramos',
    rank: 'H',
    prizePool: 30000000,
    avatar: 'https://placehold.co/47x47',
    position: 4,
    trend: 'up',
    isOnline: true
  },
  {
    id: '5',
    name: 'Paul C. Ramos',
    rank: 'H',
    prizePool: 20000000,
    avatar: 'https://placehold.co/47x47',
    position: 5,
    trend: 'up',
    isOnline: true
  },
  {
    id: '6',
    name: 'Paul C. Ramos',
    rank: 'H',
    prizePool: 10500000,
    avatar: 'https://placehold.co/47x47',
    position: 6,
    trend: 'down',
    isOnline: true
  },
];

export const RankingScreen: React.FC<RankingScreenProps> = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState<'prizePool' | 'elo' | 'spa'>('prizePool');

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} Million`;
    }
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={22} color="#161722" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Bảng xếp hạng</Text>
      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={18} color="#161722" />
      </TouchableOpacity>
    </View>
  );

  const renderTabIcons = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'prizePool' && styles.tabItemActive]}
        onPress={() => setSelectedTab('prizePool')}
      >
        <Trophy size={20} color={selectedTab === 'prizePool' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'elo' && styles.tabItemActive]}
        onPress={() => setSelectedTab('elo')}
      >
        <TrendingUp size={20} color={selectedTab === 'elo' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'spa' && styles.tabItemActive]}
        onPress={() => setSelectedTab('spa')}
      >
        <Swords size={20} color={selectedTab === 'spa' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
    </View>
  );

  const renderSubTabs = () => (
    <View style={styles.subTabContainer}>
      <TouchableOpacity 
        style={[styles.subTab, selectedTab === 'prizePool' && styles.subTabActive]}
        onPress={() => setSelectedTab('prizePool')}
      >
        <Text style={[styles.subTabText, selectedTab === 'prizePool' && styles.subTabTextActive]}>
          Prize Pool
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subTab, selectedTab === 'elo' && styles.subTabActive]}
        onPress={() => setSelectedTab('elo')}
      >
        <Text style={[styles.subTabText, selectedTab === 'elo' && styles.subTabTextActive]}>
          ELO
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subTab, selectedTab === 'spa' && styles.subTabActive]}
        onPress={() => setSelectedTab('spa')}
      >
        <Text style={[styles.subTabText, selectedTab === 'spa' && styles.subTabTextActive]}>
          SPA
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTopPlayer = () => {
    const topPlayer = mockRankingData[0];
    return (
      <View style={styles.topPlayerContainer}>
        <View style={styles.topPlayerImageContainer}>
          <Image source={{ uri: topPlayer.avatar }} style={styles.topPlayerImage} />
          <View style={styles.crownContainer}>
            <Crown size={40} color="#FFD700" fill="#FFD700" />
          </View>
        </View>
        
        <View style={styles.topPlayerInfo}>
          <View style={styles.positionContainer}>
            <Text style={styles.positionHash}>#</Text>
            <Text style={styles.positionNumber}>1</Text>
          </View>
          <Text style={styles.topPlayerPrize}>{formatCurrency(topPlayer.prizePool)}</Text>
          <View style={styles.topPlayerRank}>
            <Text style={styles.rankLabel}>RANK : {topPlayer.rank}</Text>
          </View>
          <TouchableOpacity style={styles.challengeButton}>
            <Swords size={16} color="white" />
            <Text style={styles.challengeButtonText}>Thách đấu</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.topPlayerName}>{topPlayer.name}</Text>
      </View>
    );
  };

  const renderRankingList = () => {
    const otherPlayers = mockRankingData.slice(1);
    
    return (
      <View style={styles.rankingListContainer}>
        {otherPlayers.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <View style={styles.playerPosition}>
              <Text style={styles.positionText}>{player.position}</Text>
              {player.trend === 'up' && <TrendingUp size={12} color="#10B981" />}
              {player.trend === 'down' && <TrendingDown size={12} color="#EF4444" />}
            </View>
            
            <View style={styles.playerImageContainer}>
              {player.position <= 3 ? (
                <Image source={{ uri: player.avatar }} style={styles.playerImageLarge} />
              ) : (
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                  <View style={[styles.onlineIndicator, { backgroundColor: player.isOnline ? '#5AD439' : '#86878B' }]} />
                </View>
              )}
            </View>
            
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerRank}>Rank {player.rank}</Text>
            </View>
            
            <View style={styles.playerPrizeContainer}>
              <Text style={styles.playerPrize}>{formatCurrency(player.prizePool)}</Text>
              {player.position <= 3 && (
                <TouchableOpacity style={styles.smallChallengeButton}>
                  <Swords size={12} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabIcons()}
      {renderSubTabs()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTopPlayer()}
        {renderRankingList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#161722',
  },
  moreButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#060606',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subTab: {
    marginRight: 24,
    paddingBottom: 4,
  },
  subTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0A5C6D',
  },
  subTabText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#CCCCCE',
  },
  subTabTextActive: {
    color: '#0A5C6D',
    fontWeight: '700',
  },
  topPlayerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  topPlayerImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  topPlayerImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    right: -10,
  },
  topPlayerInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  positionHash: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  positionNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  topPlayerPrize: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A5C6D',
    marginBottom: 8,
  },
  topPlayerRank: {
    backgroundColor: '#1E1775',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  rankLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  topPlayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rankingListContainer: {
    paddingHorizontal: 16,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerPosition: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  positionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  playerImageContainer: {
    marginRight: 12,
  },
  playerImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  playerRank: {
    fontSize: 14,
    color: '#666',
  },
  playerPrizeContainer: {
    alignItems: 'flex-end',
  },
  playerPrize: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A5C6D',
    marginBottom: 4,
  },
  smallChallengeButton: {
    backgroundColor: '#FF4444',
    padding: 6,
    borderRadius: 12,
  },
});