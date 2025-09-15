import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MatchCard, TournamentMatch } from '@/components/tournaments/MatchCard';
import { generateWinnersBracketData } from '@/lib/demo-data/tournament-bracket-data';

export default function TournamentBracketDemo() {
  const matches = generateWinnersBracketData();
  
  // Organize matches by rounds
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, TournamentMatch[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Bracket Demo</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bracketContainer}
      >
        {Object.entries(rounds).map(([roundNum, roundMatches]) => (
          <View key={roundNum} style={styles.roundColumn}>
            <Text style={styles.roundTitle}>
              ROUND {roundNum}
            </Text>
            {roundMatches.map((match) => (
              <View key={match.id} style={styles.matchWrapper}>
                <MatchCard 
                  match={match}
                  onPress={() => console.log('Match pressed:', match.id)}
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