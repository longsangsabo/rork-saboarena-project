import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MoreHorizontal,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Play,
  Swords
} from 'lucide-react-native';

interface TournamentDetailProps {
  tournament: {
    id: string;
    title: string;
    participants: number;
    maxParticipants: number;
    date: string;
    rank: string;
    prizePool: number;
    status: 'ready' | 'live' | 'done';
    ballType: number;
  };
  onBack: () => void;
}

interface Participant {
  id: string;
  name: string;
  rank: string;
  elo: number;
  avatar: string;
  isOnline: boolean;
}

interface Prize {
  position: number;
  money: number;
  reward: string;
  elo: number;
  spa: number;
}

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Paul C. Ramos',
    rank: 'H',
    elo: 1300,
    avatar: 'https://placehold.co/47x47',
    isOnline: true
  },
  // Add more participants...
];

const mockPrizes: Prize[] = [
  { position: 1, money: 5000000, reward: 'Cúp', elo: 100, spa: 1000 },
  { position: 2, money: 2000000, reward: 'Cúp', elo: 50, spa: 1000 },
  { position: 3, money: 1000000, reward: 'Cúp', elo: 25, spa: 1000 },
  { position: 4, money: 0, reward: '-', elo: 15, spa: 1000 },
  { position: 5, money: 0, reward: '-', elo: 15, spa: 1000 },
  { position: 6, money: 0, reward: '-', elo: 15, spa: 1000 },
];

export const TournamentDetail: React.FC<TournamentDetailProps> = ({
  tournament,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState<'rewards' | 'info' | 'participants'>('rewards');
  const [selectedSubTab, setSelectedSubTab] = useState<'ready' | 'live' | 'done'>('ready');

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getBallColor = (ballNumber: number) => {
    switch (ballNumber) {
      case 8: return '#000000';
      case 9: return '#FFD700';
      case 10: return '#0066CC';
      default: return '#000000';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={22} color="#161722" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Giải đấu</Text>
      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={18} color="#161722" />
      </TouchableOpacity>
    </View>
  );

  const renderTabIcons = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'participants' && styles.tabItemActive]}
        onPress={() => setSelectedTab('participants')}
      >
        <Users size={20} color={selectedTab === 'participants' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'rewards' && styles.tabItemActive]}
        onPress={() => setSelectedTab('rewards')}
      >
        <Trophy size={20} color={selectedTab === 'rewards' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, selectedTab === 'info' && styles.tabItemActive]}
        onPress={() => setSelectedTab('info')}
      >
        <MapPin size={20} color={selectedTab === 'info' ? '#060606' : '#8A8B8F'} />
      </TouchableOpacity>
    </View>
  );

  const renderSubTabs = () => (
    <View style={styles.subTabContainer}>
      <TouchableOpacity 
        style={[styles.subTab, selectedSubTab === 'ready' && styles.subTabActive]}
        onPress={() => setSelectedSubTab('ready')}
      >
        <Text style={[styles.subTabText, selectedSubTab === 'ready' && styles.subTabTextActive]}>
          Ready
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subTab, selectedSubTab === 'live' && styles.subTabActive]}
        onPress={() => setSelectedSubTab('live')}
      >
        <Text style={[styles.subTabText, selectedSubTab === 'live' && styles.subTabTextActive]}>
          Live
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.subTab, selectedSubTab === 'done' && styles.subTabActive]}
        onPress={() => setSelectedSubTab('done')}
      >
        <Text style={[styles.subTabText, selectedSubTab === 'done' && styles.subTabTextActive]}>
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTournamentInfo = () => (
    <View style={styles.tournamentInfoContainer}>
      <View style={styles.ballIconContainer}>
        <View style={[styles.ballIcon, { backgroundColor: getBallColor(tournament.ballType) }]}>
          <Text style={styles.ballNumber}>{tournament.ballType}</Text>
        </View>
      </View>
      
      <View style={styles.tournamentDetails}>
        <Text style={styles.tournamentTitle}>{tournament.title}</Text>
        <View style={styles.tournamentMeta}>
          <View style={styles.metaItem}>
            <Users size={16} color="#FF004F" />
            <Text style={styles.metaText}>{tournament.participants}/{tournament.maxParticipants} người</Text>
          </View>
          <Text style={styles.metaText}>2 Mạng</Text>
        </View>
        <View style={styles.tournamentMeta}>
          <Calendar size={16} color="#666" />
          <Text style={styles.metaText}>{tournament.date}</Text>
          <Text style={styles.rankText}>Rank: {tournament.rank}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.prizeButton}>
            <Text style={styles.prizeButtonText}>Tổng : {formatCurrency(tournament.prizePool)} Million</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.liveButton}>
            <Play size={16} color="white" />
            <Text style={styles.liveButtonText}>Xem Live</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPrizesTable = () => (
    <View style={styles.prizesContainer}>
      <Text style={styles.sectionTitle}>Phần thưởng</Text>
      
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>TOP</Text>
        <Text style={styles.tableHeaderText}>MONEY</Text>
        <Text style={styles.tableHeaderText}>REWARD</Text>
        <Text style={styles.tableHeaderText}>ELO</Text>
        <Text style={styles.tableHeaderText}>SPA</Text>
      </View>
      
      {mockPrizes.map((prize) => (
        <View key={prize.position} style={styles.prizeRow}>
          <View style={styles.positionContainer}>
            {prize.position <= 3 ? (
              <View style={[styles.medalIcon, { backgroundColor: prize.position === 1 ? '#FFD700' : prize.position === 2 ? '#C0C0C0' : '#CD7F32' }]}>
                <Text style={styles.positionNumber}>{prize.position}</Text>
              </View>
            ) : (
              <View style={styles.numberIcon}>
                <Text style={styles.positionNumber}>{prize.position}</Text>
              </View>
            )}
          </View>
          <Text style={styles.prizeValue}>{formatCurrency(prize.money)}</Text>
          <Text style={styles.prizeValue}>{prize.reward}</Text>
          <Text style={styles.prizeValue}>{prize.elo}</Text>
          <Text style={styles.prizeValue}>{prize.spa}</Text>
        </View>
      ))}
    </View>
  );

  const renderParticipants = () => (
    <View style={styles.participantsContainer}>
      <Text style={styles.sectionTitle}>Thành viên</Text>
      
      {mockParticipants.map((participant, index) => (
        <View key={participant.id} style={styles.participantRow}>
          <View style={styles.participantRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.participantInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
              <View style={[styles.onlineIndicator, { backgroundColor: participant.isOnline ? '#5AD439' : '#86878B' }]} />
            </View>
            <View style={styles.participantDetails}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <Text style={styles.participantRankText}>Rank {participant.rank}</Text>
            </View>
          </View>
          <Text style={styles.participantElo}>{participant.elo} ELO</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabIcons()}
      {renderSubTabs()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTournamentInfo()}
        
        {selectedTab === 'rewards' && renderPrizesTable()}
        {selectedTab === 'participants' && renderParticipants()}
        {selectedTab === 'info' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Thông tin chi tiết sẽ có sớm</Text>
          </View>
        )}
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
  tournamentInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ballIconContainer: {
    marginRight: 16,
  },
  ballIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  ballNumber: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  tournamentDetails: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A5C6D',
    marginBottom: 8,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  rankText: {
    fontSize: 14,
    color: '#0A5C6D',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  prizeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  prizeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  liveButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  prizesContainer: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  positionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  medalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  prizeValue: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  participantsContainer: {
    padding: 16,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  participantRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  participantAvatar: {
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
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  participantRankText: {
    fontSize: 12,
    color: '#666',
  },
  participantElo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A5C6D',
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
});