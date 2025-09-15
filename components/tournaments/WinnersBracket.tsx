import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import { MatchCard, TournamentMatch, Player } from './MatchCard';
import { useTheme } from '@/providers/ThemeProvider';

interface BracketRound {
  roundNumber: number;
  roundName: string;
  matches: TournamentMatch[];
}

interface WinnersBracketProps {
  matches: TournamentMatch[];
  onMatchPress?: (match: TournamentMatch) => void;
  onWinnerAdvance?: (matchId: string, winnerId: string) => void;
}

export function WinnersBracket({ matches, onMatchPress, onWinnerAdvance }: WinnersBracketProps) {
  const theme = useTheme();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // Organize matches into rounds based on label patterns
  const bracketRounds = useMemo(() => {
    const rounds: BracketRound[] = [];
    
    // Group matches by round patterns
    const roundGroups = new Map<string, TournamentMatch[]>();
    
    matches.forEach(match => {
      let roundKey = '';
      
      if (match.label.includes('WINNER ROUND 1')) {
        roundKey = 'round1';
      } else if (match.label.includes('WINNER ROUND 2')) {
        roundKey = 'round2';
      } else if (match.label.includes('SEMI FINAL')) {
        roundKey = 'semifinal';
      } else if (match.label.includes('FINAL')) {
        roundKey = 'final';
      } else {
        // Parse round number from label
        const roundMatch = match.label.match(/ROUND (\d+)/);
        if (roundMatch) {
          const roundNum = parseInt(roundMatch[1]);
          if (roundNum >= 100 && roundNum < 200) {
            roundKey = 'round1';
          } else if (roundNum >= 200 && roundNum < 300) {
            roundKey = 'round2';
          } else if (roundNum >= 300) {
            roundKey = 'round3';
          }
        }
      }
      
      if (!roundGroups.has(roundKey)) {
        roundGroups.set(roundKey, []);
      }
      roundGroups.get(roundKey)!.push(match);
    });

    // Create rounds array
    const roundOrder = ['round1', 'round2', 'round3', 'semifinal', 'final'];
    const roundNames = {
      'round1': 'Vòng 1',
      'round2': 'Vòng 2', 
      'round3': 'Vòng 3',
      'semifinal': 'Bán kết',
      'final': 'Chung kết'
    };

    roundOrder.forEach((roundKey, index) => {
      if (roundGroups.has(roundKey)) {
        const roundMatches = roundGroups.get(roundKey)!;
        // Sort matches by ID to maintain consistent order
        roundMatches.sort((a, b) => a.id.localeCompare(b.id));
        
        rounds.push({
          roundNumber: index + 1,
          roundName: roundNames[roundKey as keyof typeof roundNames],
          matches: roundMatches
        });
      }
    });

    return rounds;
  }, [matches]);

  // Calculate bracket progression lines
  const getBracketConnections = (fromRound: number, toRound: number) => {
    if (fromRound >= bracketRounds.length || toRound >= bracketRounds.length) {
      return [];
    }

    const connections: Array<{
      fromMatch: string;
      toMatch: string;
      fromPosition: number;
      toPosition: number;
    }> = [];

    const fromMatches = bracketRounds[fromRound].matches;
    const toMatches = bracketRounds[toRound].matches;

    // Simple pairing logic - every 2 matches from current round feed into 1 match in next round
    for (let i = 0; i < toMatches.length; i++) {
      const match1Index = i * 2;
      const match2Index = i * 2 + 1;

      if (match1Index < fromMatches.length) {
        connections.push({
          fromMatch: fromMatches[match1Index].id,
          toMatch: toMatches[i].id,
          fromPosition: match1Index,
          toPosition: i
        });
      }

      if (match2Index < fromMatches.length) {
        connections.push({
          fromMatch: fromMatches[match2Index].id,
          toMatch: toMatches[i].id,
          fromPosition: match2Index,
          toPosition: i
        });
      }
    }

    return connections;
  };

  const handleMatchPress = (match: TournamentMatch) => {
    setSelectedMatch(match.id);
    onMatchPress?.(match);
  };

  const cardWidth = Math.min(280, screenWidth * 0.8);
  const roundSpacing = cardWidth + 40;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colorStyle('light.surface') }]}>
        <Text style={[styles.headerTitle, { color: theme.colorStyle('light.text') }]}>
          Nhánh thắng
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colorStyle('light.textSecondary') }]}>
          Winners' Bracket
        </Text>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bracketContainer}
        style={styles.scrollContainer}
      >
        {bracketRounds.map((round, roundIndex) => (
          <View 
            key={round.roundNumber}
            style={[
              styles.roundColumn,
              { 
                width: cardWidth,
                marginRight: roundIndex < bracketRounds.length - 1 ? 40 : 20 
              }
            ]}
          >
            {/* Round Header */}
            <View style={styles.roundHeader}>
              <Text style={[
                styles.roundTitle,
                { color: theme.colorStyle('sabo.primary.500') }
              ]}>
                {round.roundName}
              </Text>
              <Text style={[
                styles.roundCount,
                { color: theme.colorStyle('light.textSecondary') }
              ]}>
                {round.matches.length} trận
              </Text>
            </View>

            {/* Matches in this round */}
            <View style={styles.matchesContainer}>
              {round.matches.map((match, matchIndex) => (
                <View key={match.id} style={styles.matchWrapper}>
                  <MatchCard
                    match={match}
                    onMatchPress={handleMatchPress}
                    isHighlighted={selectedMatch === match.id}
                  />
                  
                  {/* Connection lines to next round */}
                  {roundIndex < bracketRounds.length - 1 && (
                    <View style={styles.connectionContainer}>
                      <View style={[
                        styles.connectionLine,
                        { backgroundColor: theme.colorStyle('light.border') }
                      ]} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Tournament Status */}
      <View style={[styles.statusBar, { backgroundColor: theme.colorStyle('light.surface') }]}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#22c55e' }]} />
          <Text style={[styles.statusText, { color: theme.colorStyle('light.textSecondary') }]}>
            Hoàn thành
          </Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={[styles.statusText, { color: theme.colorStyle('light.textSecondary') }]}>
            Đang diễn ra
          </Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#6b7280' }]} />
          <Text style={[styles.statusText, { color: theme.colorStyle('light.textSecondary') }]}>
            Chờ đối thủ
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  bracketContainer: {
    padding: 20,
    alignItems: 'flex-start',
  },
  roundColumn: {
    minHeight: 400,
  },
  roundHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roundCount: {
    fontSize: 12,
    marginTop: 2,
  },
  matchesContainer: {
    gap: 16,
  },
  matchWrapper: {
    position: 'relative',
  },
  connectionContainer: {
    position: 'absolute',
    right: -40,
    top: '50%',
    width: 40,
    height: 2,
    zIndex: 1,
  },
  connectionLine: {
    width: '100%',
    height: 2,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});