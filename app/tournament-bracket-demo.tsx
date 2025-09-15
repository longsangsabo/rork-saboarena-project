import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MatchCard, TournamentMatch } from '@/components/tournaments/MatchCard';

export default function TournamentBracketDemo() {
  // Simple demo matches
  const matches: TournamentMatch[] = [
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
  
  // Organize matches by rounds - simplified for demo
  const rounds = { 1: matches };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Bracket Demo</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bracketContainer}
      >
        {Object.entries(rounds).map(([roundNum, roundMatches]: [string, TournamentMatch[]]) => (
          <View key={roundNum} style={styles.roundColumn}>
            <Text style={styles.roundTitle}>
              ROUND {roundNum}
            </Text>
            {roundMatches.map((match) => (
              <View key={match.id} style={styles.matchWrapper}>
                <MatchCard 
                  match={match}
                  onMatchPress={() => console.log('Match pressed:', match.id)}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#161722',
  },
  bracketContainer: {
    padding: 20,
  },
  roundColumn: {
    width: 280,
    marginRight: 20,
  },
  roundTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B5CF6',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchWrapper: {
    marginBottom: 16,
  },
});