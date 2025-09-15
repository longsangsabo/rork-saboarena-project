import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { MatchCard, TournamentMatch } from './MatchCard';
import { useTheme } from '@/providers/ThemeProvider';

interface SemiFinalProps {
  matches: TournamentMatch[];
  onMatchPress?: (match: TournamentMatch) => void;
  onWinnerAdvance?: (matchId: string, winnerId: string) => void;
  canStart?: boolean;
}

export function SemiFinal({ matches, onMatchPress, onWinnerAdvance, canStart = false }: SemiFinalProps) {
  const theme = useTheme();

  // Organize matches by type
  const { semiMatches, finalMatch } = useMemo(() => {
    const semiMatches = matches.filter(match => match.id.includes('semi_final_round'));
    const finalMatch = matches.find(match => match.id === 'final_match');
    
    return { semiMatches, finalMatch };
  }, [matches]);

  const handleMatchPress = (match: TournamentMatch) => {
    onMatchPress?.(match);
  };

  if (!canStart) {
    return (
      <View style={styles.notReadyContainer}>
        <Text style={[styles.notReadyTitle, { color: theme.colors.sabo.primary[600] }]}>
          Semi Final chưa sẵn sàng
        </Text>
        <Text style={[styles.notReadyText, { color: theme.colors.sabo.primary[500] }]}>
          Cần hoàn thành:
        </Text>
        <View style={styles.requirementsList}>
          <Text style={[styles.requirementItem, { color: theme.colors.sabo.primary[400] }]}>
            • Winners Bracket Semi Final (2 winners)
          </Text>
          <Text style={[styles.requirementItem, { color: theme.colors.sabo.primary[400] }]}>
            • Losers Branch A (1 champion)
          </Text>
          <Text style={[styles.requirementItem, { color: theme.colors.sabo.primary[400] }]}>
            • Losers Branch B (1 champion)
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.light.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Semi Final Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: '#FF6B35' }]}>
            SEMI FINAL
          </Text>
        </View>

        <View style={styles.semiMatchesContainer}>
          {semiMatches.map((match, index) => (
            <View key={match.id} style={styles.semiMatchWrapper}>
              <Text style={[styles.matchLabel, { color: theme.colors.sabo.primary[600] }]}>
                #{match.label}
              </Text>
              <MatchCard 
                match={match}
                onMatchPress={() => handleMatchPress(match)}
                isHighlighted={false}
              />
            </View>
          ))}
        </View>

        {/* Visual connection lines */}
        <View style={styles.connectionContainer}>
          <View style={[styles.connectionLine, { backgroundColor: theme.colors.sabo.primary[300] }]} />
          <View style={[styles.connectionJoint, { backgroundColor: theme.colors.sabo.primary[400] }]} />
          <View style={[styles.connectionLine, { backgroundColor: theme.colors.sabo.primary[300] }]} />
        </View>
      </View>

      {/* Final Section */}
      {finalMatch && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: '#FFD700' }]}>
              FINAL
            </Text>
          </View>

          <View style={styles.finalMatchContainer}>
            <Text style={[styles.matchLabel, { color: theme.colors.sabo.secondary[600] }]}>
              #{finalMatch.label}
            </Text>
            <MatchCard 
              match={finalMatch}
              onMatchPress={() => handleMatchPress(finalMatch)}
              isHighlighted={true}
            />
          </View>
        </View>
      )}

      {/* Tournament Summary */}
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryTitle, { color: theme.colors.sabo.primary[600] }]}>
          Tournament Flow
        </Text>
        <View style={styles.summaryFlow}>
          <Text style={[styles.summaryText, { color: theme.colors.sabo.primary[500] }]}>
            16 Players → Winners Bracket (2 survivors) + Losers Branches (2 champions)
          </Text>
          <Text style={[styles.summaryText, { color: theme.colors.sabo.primary[500] }]}>
            → Semi Final (4 players → 2 matches → 2 survivors)
          </Text>
          <Text style={[styles.summaryText, { color: theme.colors.sabo.primary[500] }]}>
            → Final (2 players → 1 match → 1 Champion)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  notReadyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notReadyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  notReadyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  requirementsList: {
    alignItems: 'flex-start',
  },
  requirementItem: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  semiMatchesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  semiMatchWrapper: {
    flex: 1,
    maxWidth: '48%',
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  connectionLine: {
    flex: 1,
    height: 2,
  },
  connectionJoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  finalMatchContainer: {
    alignItems: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  summaryContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'rgba(123, 92, 246, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7B5CF6',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryFlow: {
    gap: 8,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
});