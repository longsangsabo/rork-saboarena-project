import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { RankingUser } from '@/components/shared/RankingCard';

interface RankingListProps {
  users: RankingUser[];
  type: 'prizepool' | 'elo' | 'spa';
  onChallenge: (userId: string) => void;
}

export function RankingList({ users, type, onChallenge }: RankingListProps) {


  const formatValue = (value: string, type: 'prizepool' | 'elo' | 'spa') => {
    return value;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.listContainer}>
        {users.map((user, index) => (
          <View key={user.id} style={styles.userItem}>
            <View style={styles.userInfo}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userRank}>Rank {user.rank}</Text>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              <Text style={styles.scoreValue}>
                {formatValue(user.value, type)}
              </Text>
              <TouchableOpacity
                style={styles.challengeButton}
                onPress={() => onChallenge(user.id)}
              >
                <Text style={styles.challengeButtonText}>Thách đấu</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161722',
    marginBottom: 2,
  },
  userRank: {
    fontSize: 12,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#161722',
    marginBottom: 4,
  },
  challengeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  challengeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});