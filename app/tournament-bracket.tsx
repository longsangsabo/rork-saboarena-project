import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/providers/ThemeProvider';
import { WinnersBracket } from '@/components/tournaments/WinnersBracket';
import { LosersBracket } from '@/components/tournaments/LosersBracket';
import { SemiFinal } from '@/components/tournaments/SemiFinal';
import { BracketTabs } from '@/components/tournaments/BracketTabs';
import { TournamentMatch } from '@/components/tournaments/MatchCard';
// import { trpc } from '@/lib/trpc'; // Removed for now

export default function TournamentBracketScreen() {
  const theme = useTheme();
  const { tournamentId } = useLocalSearchParams<{ tournamentId: string }>();
  const [bracketMatches, setBracketMatches] = useState<TournamentMatch[]>([]);
  const [losersMatches, setLosersMatches] = useState<TournamentMatch[]>([]);
  const [semiFinalMatches, setSemiFinalMatches] = useState<TournamentMatch[]>([]);
  const [activeTab, setActiveTab] = useState('winner');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTournamentId, setCurrentTournamentId] = useState<string | null>(tournamentId || null);

  // Simplified approach - just show demo data for now
  const tournamentsListQuery = { 
    data: { tournaments: [{ id: 'demo-1', name: 'Demo Tournament' }] }, 
    isLoading: false, 
    error: null 
  };
  
  const bracketQuery = { 
    data: { tournaments: [] }, 
    error: null 
  };

  // Auto-select first tournament if no tournamentId provided
  useEffect(() => {
    if (!tournamentId) {
      setCurrentTournamentId('demo-tournament');
    }
  }, [tournamentId]);

  // Simple demo match generator
  const generateDemoMatches = (): TournamentMatch[] => [
    {
      id: 'demo-1',
      label: 'Demo Match 1',
      player1: { id: '1', name: 'Player 1', rank: 'A', avatar: '' },
      player2: { id: '2', name: 'Player 2', rank: 'B', avatar: '' },
      winner: { id: '1', name: 'Player 1', rank: 'A', avatar: '' },
      score: { player1: 21, player2: 15 },
      status: 'completed' as const,
      gameInfo: {
        handicap: '0',
        table: '1',
        raceType: 'race-to-9'
      }
    }
  ];

  // Initialize bracket data
  useEffect(() => {
    // Always use demo data for now
    const demoMatches = generateDemoMatches();
    setBracketMatches(demoMatches);
    setLosersMatches([]);
    setSemiFinalMatches([]);
    setIsLoading(false);
  }, []);

  // Handle match updates (when user views/updates a match)
  const handleMatchUpdate = async (match: TournamentMatch) => {
    try {
      console.log('Match update:', match.id, match.label);
      // TODO: Implement cross-platform modal for match details
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  // Handle winner advancement in winners bracket
  const handleWinnerAdvancement = (matchId: string, winnerId: string) => {
    console.log('Winner advancement:', matchId, winnerId);
    // TODO: Implement real bracket advancement logic
  };

  // Handle winner advancement in losers bracket
  const handleLosersAdvancement = (matchId: string, winnerId: string) => {
    console.log('Losers advancement:', matchId, winnerId);
    // TODO: Implement real losers bracket advancement logic
  };

  // Handle winner advancement in semi final
  const handleSemiFinalAdvancement = (matchId: string, winnerId: string) => {
    console.log('Semi-final advancement:', matchId, winnerId);
    // TODO: Implement real semi-final advancement logic
  };

  // Show loading spinner
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
'Đang tải bảng đấu...'
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Skip tournament selection for now - always show bracket

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
            canStart={false}
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
  selectorContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  tournamentItem: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  noTournamentText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  viewDemoButton: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginTop: 10,
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