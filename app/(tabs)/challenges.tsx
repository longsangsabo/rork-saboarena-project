import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList,
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { AppHeader } from '@/components/shared/AppHeader';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { Users, Trophy, X } from 'lucide-react-native';
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

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'waiting' | 'live' | 'finished');
  };

  // Use mock data for now, replace with real data when available
  const challengesData = challengesQuery.data || getChallengesByStatus(activeTab);
  const challenges = Array.isArray(challengesData) ? challengesData : challengesData.challenges || [];

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <ChallengeCard
      {...item}
      onJoin={() => handleJoinChallenge(item.id)}
      onViewLive={() => handleViewLive(item.id)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader title="Thách Đấu" showBackButton={true} showMoreButton={true} onBack={handleBack} onMore={handleMore} />
      <UniversalTabs 
        tabs={challengeTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        variant="underline" 
      />
      
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