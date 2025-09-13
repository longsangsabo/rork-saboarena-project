import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ChallengeCard from './ChallengeCard';
import { Challenge } from '@/demo-data/challenges-data';

interface ChallengesListProps {
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
  onViewLive: (challengeId: string) => void;
  onCancelChallenge?: (challengeId: string) => void;
}

export const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onJoinChallenge,
  onViewLive,
  onCancelChallenge
}) => {
  const renderChallenge = ({ item }: { item: Challenge }) => (
    <ChallengeCard
      {...item}
      onJoin={() => onJoinChallenge(item.id)}
      onViewLive={() => onViewLive(item.id)}
      onCancel={onCancelChallenge ? () => onCancelChallenge(item.id) : undefined}
    />
  );

  return (
    <FlatList
      data={challenges}
      renderItem={renderChallenge}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});