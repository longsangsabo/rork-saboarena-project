import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/providers/ThemeProvider';
import { WinnersBracket } from '@/components/tournaments/WinnersBracket';
import { LosersBracket } from '@/components/tournaments/LosersBracket';
import { SemiFinal } from '@/components/tournaments/SemiFinal';
import { BracketTabs } from '@/components/tournaments/BracketTabs';
import { TournamentMatch, Player } from '@/components/tournaments/MatchCard';
import { generateWinnersBracketData, advanceWinner } from '@/lib/demo-data/tournament-bracket-data';
import { generateLosersBracketData, populateLosersFromWinners, advanceLosersBracketWinner } from '@/lib/demo-data/losers-bracket-data';
import { generateSemiFinalData, populateSemiFinalFromBrackets, advanceSemiFinalWinner, canStartSemiFinal } from '@/lib/demo-data/semi-final-data';
import { trpc } from '@/lib/trpc';

export default function TournamentBracketScreen() {
  const theme = useTheme();
  const { tournamentId } = useLocalSearchParams<{ tournamentId: string }>();
  const [bracketMatches, setBracketMatches] = useState<TournamentMatch[]>([]);
  const [losersMatches, setLosersMatches] = useState<TournamentMatch[]>([]);
  const [semiFinalMatches, setSemiFinalMatches] = useState<TournamentMatch[]>([]);
  const [activeTab, setActiveTab] = useState('winner');
  const [isLoading, setIsLoading] = useState(true);

  // TRPC query for tournament bracket data
  const bracketQuery = trpc.tournaments?.getBracket?.useQuery(
    { tournamentId: tournamentId || '' },
    { 
      enabled: !!tournamentId,
      retry: false 
    }
  );

  // Initialize bracket data
  useEffect(() => {
    if (bracketQuery.data?.matches) {
      // Use real data from API
      setBracketMatches(bracketQuery.data.matches);
      // Generate losers bracket from winners data
      const losersData = generateLosersBracketData();
      const populatedLosers = populateLosersFromWinners(bracketQuery.data.matches, losersData);
      setLosersMatches(populatedLosers);
      // Generate semi final
      const semiFinalData = generateSemiFinalData();
      const populatedSemiFinal = populateSemiFinalFromBrackets(bracketQuery.data.matches, populatedLosers, semiFinalData);
      setSemiFinalMatches(populatedSemiFinal);
      setIsLoading(false);
    } else if (bracketQuery.error || !tournamentId) {
      // Fallback to demo data if API fails or no tournamentId
      const demoMatches = generateWinnersBracketData();
      setBracketMatches(demoMatches);
      // Generate losers bracket
      const losersData = generateLosersBracketData();
      const populatedLosers = populateLosersFromWinners(demoMatches, losersData);
      setLosersMatches(populatedLosers);
      // Generate semi final
      const semiFinalData = generateSemiFinalData();
      const populatedSemiFinal = populateSemiFinalFromBrackets(demoMatches, populatedLosers, semiFinalData);
      setSemiFinalMatches(populatedSemiFinal);
      setIsLoading(false);
    }
  }, [bracketQuery.data, bracketQuery.error, tournamentId]);

  // Handle match updates (when user views/updates a match)
  const handleMatchUpdate = async (match: TournamentMatch) => {
    try {
      // Show match details or allow score input
      Alert.alert(
        match.label,
        `${match.player1?.name || 'TBD'} vs ${match.player2?.name || 'TBD'}`,
        [
          { text: 'Đóng', style: 'cancel' },
          ...(match.status === 'in_progress' ? [
            {
              text: 'Cập nhật tỷ số',
              onPress: () => {
                // TODO: Implement score update modal
                console.log('Update score for match:', match.id);
              }
            }
          ] : [])
        ]
      );
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  // Handle winner advancement in winners bracket
  const handleWinnerAdvancement = (matchId: string, winnerId: string) => {
    const updatedMatches = advanceWinner(bracketMatches, matchId, winnerId);
    setBracketMatches(updatedMatches);
    
    // Update losers bracket when winners advance
    const updatedLosers = populateLosersFromWinners(updatedMatches, losersMatches);
    setLosersMatches(updatedLosers);
    // Update semi final when brackets change
    const updatedSemiFinal = populateSemiFinalFromBrackets(updatedMatches, updatedLosers, semiFinalMatches);
    setSemiFinalMatches(updatedSemiFinal);
  };

  // Handle winner advancement in losers bracket
  const handleLosersAdvancement = (matchId: string, winnerId: string) => {
    const updatedLosersMatches = advanceLosersBracketWinner(losersMatches, matchId, winnerId);
    setLosersMatches(updatedLosersMatches);
    // Update semi final when losers advance
    const updatedSemiFinal = populateSemiFinalFromBrackets(bracketMatches, updatedLosersMatches, semiFinalMatches);
    setSemiFinalMatches(updatedSemiFinal);
  };

  // Handle winner advancement in semi final
  const handleSemiFinalAdvancement = (matchId: string, winnerId: string) => {
    const updatedSemiMatches = advanceSemiFinalWinner(semiFinalMatches, matchId, winnerId);
    setSemiFinalMatches(updatedSemiMatches);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.light.background }]}>
        <Stack.Screen 
          options={{
            headerShown: true,
            title: 'Bảng đấu',
            headerTitleAlign: 'center',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.sabo.primary[500]} />
          <Text style={[styles.loadingText, { color: theme.colors.light.text }]}>
            Đang tải bảng đấu...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderBracketContent = () => {
    switch (activeTab) {
      case 'winner':
        return (
          <WinnersBracket 
            matches={bracketMatches}
            onMatchPress={handleMatchUpdate}
            onWinnerAdvance={handleWinnerAdvancement}
          />
        );
      case 'loser':
        return (
          <LosersBracket 
            matches={losersMatches}
            onMatchPress={handleMatchUpdate}
            onWinnerAdvance={handleLosersAdvancement}
          />
        );
      case 'semifinal':
        return (
          <SemiFinal 
            matches={semiFinalMatches}
            onMatchPress={handleMatchUpdate}
            onWinnerAdvance={handleSemiFinalAdvancement}
            canStart={canStartSemiFinal(bracketMatches, losersMatches)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.light.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Bảng đấu',
          headerTitleAlign: 'center',
        }}
      />
      
      <BracketTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {renderBracketContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});