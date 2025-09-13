import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Swords, TrendingUp, TrendingDown } from 'lucide-react-native';

export interface RankingUser {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  value: string;
  position: number;
  trend?: 'up' | 'down' | 'same';
  isOnline?: boolean;
}

interface RankingCardProps {
  user: RankingUser;
  type: 'prizepool' | 'elo' | 'spa';
  isTopRank?: boolean;
  onChallenge?: (userId: string) => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({ 
  user, 
  type, 
  isTopRank = false,
  onChallenge 
}) => {
  const getCrownColor = () => {
    if (type === 'prizepool') return '#FFD700';
    if (type === 'elo') return '#4A90E2';
    return '#9B59B6';
  };

  const getValueColor = () => {
    if (type === 'elo') return '#4A90E2';
    return '#2E7D32';
  };

  const getTrendIcon = () => {
    if (user.trend === 'up') return <TrendingUp size={12} color="#4CAF50" />;
    if (user.trend === 'down') return <TrendingDown size={12} color="#F44336" />;
    return null;
  };

  if (isTopRank) {
    return (
      <View style={styles.topCard}>
        <View style={styles.topImageContainer}>
          <Image source={{ uri: user.avatar }} style={styles.topImage} />
          <View style={[styles.crown, { backgroundColor: getCrownColor() }]}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
        </View>
        
        <Text style={styles.topName}>{user.name}</Text>
        
        <View style={styles.topInfo}>
          <Text style={styles.topPosition}>#{user.position}</Text>
          <Text style={[styles.topValue, { color: getValueColor() }]}>{user.value}</Text>
          
          <View style={styles.topActions}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>RANK : {user.rank}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.challengeButton}
              onPress={() => onChallenge?.(user.id)}
            >
              <Swords size={14} color="white" />
              <Text style={styles.challengeText}>Thách đấu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listCard}>
      <View style={styles.leftSection}>
        <View style={styles.positionSection}>
          <Text style={styles.position}>{user.position}</Text>
          {getTrendIcon()}
        </View>
        
        <View style={styles.avatarSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {user.isOnline && <View style={styles.onlineStatus} />}
        </View>
        
        <View style={styles.userSection}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.userRank}>Rank {user.rank}</Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.value, { color: getValueColor() }]}>{user.value}</Text>
        <TouchableOpacity 
          style={styles.smallChallengeButton}
          onPress={() => onChallenge?.(user.id)}
        >
          <Swords size={12} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  topImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  topImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  crown: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  crownEmoji: {
    fontSize: 18,
  },
  topName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  topInfo: {
    alignItems: 'center',
    width: '100%',
  },
  topPosition: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  topValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rankBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  rankText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: '#FF004F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  challengeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionSection: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  userSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userRank: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallChallengeButton: {
    backgroundColor: '#FF004F',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});