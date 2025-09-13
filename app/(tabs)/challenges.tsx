import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList,
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import ChallengeHeader from '@/components/challenges/ChallengeHeader';
import ChallengeTabs from '@/components/challenges/ChallengeTabs';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { getChallengesByStatus, type Challenge } from '@/demo-data/challenges-data';

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState<'waiting' | 'live' | 'finished'>('waiting');
  const insets = useSafeAreaInsets();

  const challengesQuery = trpc.challenges.list.useQuery({ 
    type: activeTab,
    limit: 10 
  });
  
  const joinChallengeMutation = trpc.challenges.join?.useMutation({
    onSuccess: () => {
      Alert.alert('Thành công', 'Đã tham gia thách đấu!');
      challengesQuery.refetch();
    }
  });

  const handleJoinChallenge = (challengeId: string) => {
    if (joinChallengeMutation) {
      joinChallengeMutation.mutate({ challengeId });
    } else {
      Alert.alert('Thành công', 'Đã tham gia thách đấu!');
    }
  };
  
  const handleViewLive = (challengeId: string) => {
    Alert.alert('Xem Live', `Đang xem trận đấu ${challengeId}`);
  };

  const handleBack = () => {
    // Navigation back logic
  };

  const handleMore = () => {
    Alert.alert('Tùy chọn', 'Hiển thị thêm tùy chọn');
  };

  // Use mock data for now, replace with real data when available
  const challenges = challengesQuery.data || getChallengesByStatus(activeTab);

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <ChallengeCard
      {...item}
      onJoin={() => handleJoinChallenge(item.id)}
      onViewLive={() => handleViewLive(item.id)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ChallengeHeader onBack={handleBack} onMore={handleMore} />
      <ChallengeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContainer: {
    paddingBottom: 20,
  },
});