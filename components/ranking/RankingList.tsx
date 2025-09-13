import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RankingCard, RankingUser } from '@/components/shared/RankingCard';

type RankingType = 'prizepool' | 'elo' | 'spa';

interface RankingListProps {
  users: RankingUser[];
  type: RankingType;
  onChallenge: (userId: string) => void;
}

export const RankingList: React.FC<RankingListProps> = ({
  users,
  type,
  onChallenge
}) => {
  const topUser = users[0];
  const otherUsers = users.slice(1);

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {topUser && (
        <RankingCard 
          user={topUser} 
          type={type} 
          isTopRank={true}
          onChallenge={onChallenge}
        />
      )}
      
      <View style={styles.listContainer}>
        {otherUsers.map((user) => (
          <RankingCard 
            key={user.id} 
            user={user} 
            type={type}
            onChallenge={onChallenge}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});