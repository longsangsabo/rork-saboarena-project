import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { X } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  isOnline: boolean;
}

interface ChallengeCardProps {
  id: string;
  status: 'waiting' | 'ready' | 'live' | 'finished';
  date: string;
  time: string;
  handicap: string;
  spa: number;
  raceToScore: number;
  tableNumber: number;
  player1: Player;
  player2?: Player;
  onJoin?: () => void;
  onCancel?: () => void;
  onViewLive?: () => void;
}

export default function ChallengeCard({
  id,
  status,
  date,
  time,
  handicap,
  spa,
  raceToScore,
  tableNumber,
  player1,
  player2,
  onJoin,
  onCancel,
  onViewLive
}: ChallengeCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'waiting':
        return '#FF6B6B';
      case 'ready':
        return '#4ECDC4';
      case 'live':
        return '#8B0000';
      case 'finished':
        return '#95A5A6';
      default:
        return '#FF6B6B';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'ready':
        return 'Ready';
      case 'live':
        return 'Xem Live';
      case 'finished':
        return 'Finished';
      default:
        return 'Waiting';
    }
  };

  const renderPlayer = (player: Player, isRight: boolean = false) => (
    <View style={[styles.playerContainer, isRight && styles.playerRight]}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: player.avatar }} style={styles.avatar} />
        <View style={[styles.onlineIndicator, { backgroundColor: player.isOnline ? '#4ECDC4' : '#FF6B6B' }]} />
      </View>
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerRank}>Rank {player.rank}</Text>
    </View>
  );

  const renderWaitingPlayer = () => (
    <View style={[styles.playerContainer, styles.playerRight]}>
      <View style={styles.avatarContainer}>
        <View style={styles.emptyAvatar}>
          <Text style={styles.questionMark}>?</Text>
        </View>
        <View style={[styles.onlineIndicator, { backgroundColor: '#FF6B6B' }]} />
      </View>
      <Text style={styles.waitingText}>Chờ đối thủ</Text>
      <Text style={styles.playerRank}>Rank: I → H+</Text>
      {status === 'waiting' && (
        <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
          <X size={16} color="white" />
          <Text style={styles.joinButtonText}>Tham gia</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {/* Date and Time */}
      <Text style={styles.dateTime}>{date}</Text>
      <Text style={styles.dateTime}>{time}</Text>

      {/* Players */}
      <View style={styles.playersContainer}>
        {renderPlayer(player1)}
        
        {/* VS Section */}
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>?</Text>
          <Text style={styles.dashText}>—</Text>
          <Text style={styles.vsText}>?</Text>
        </View>

        {player2 ? renderPlayer(player2, true) : renderWaitingPlayer()}
      </View>

      {/* Game Info */}
      <Text style={styles.handicapText}>{handicap}</Text>
      
      <View style={styles.gameInfoContainer}>
        <View style={styles.spaContainer}>
          <View style={styles.spaIcon} />
          <Text style={styles.spaText}>{spa} SPA</Text>
        </View>
        <Text style={styles.raceText}>Race to {raceToScore}</Text>
      </View>
      
      <Text style={styles.tableText}>Bàn {tableNumber}</Text>

      {/* Action Buttons */}
      {status === 'live' && (
        <TouchableOpacity style={styles.liveButton} onPress={onViewLive}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveButtonText}>Xem Live</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: [{ translateX: -30 }],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dateTime: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  playerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  playerRight: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#333',
  },
  emptyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  playerRank: {
    fontSize: 12,
    color: '#666',
  },
  waitingText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 2,
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  vsText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  dashText: {
    fontSize: 20,
    color: '#666',
    marginVertical: 4,
  },
  handicapText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  gameInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  spaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  spaIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 4,
  },
  spaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  raceText: {
    fontSize: 14,
    color: '#666',
  },
  tableText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  liveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});