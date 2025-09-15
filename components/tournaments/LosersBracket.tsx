import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions } from 'react-native';
import { MatchCard, TournamentMatch, Player } from './MatchCard';
import { useTheme } from '@/providers/ThemeProvider';

interface LosersBracketRound {
  roundNumber: number;
  roundName: string;
  matches: TournamentMatch[];
}

interface LosersBracketProps {
  matches: TournamentMatch[];
  onMatchPress?: (match: TournamentMatch) => void;
  onWinnerAdvance?: (matchId: string, winnerId: string) => void;
}

interface BranchData {
  name: string;
  subtitle: string;
  rounds: LosersBracketRound[];
}

export function LosersBracket({ matches, onMatchPress, onWinnerAdvance }: LosersBracketProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Helper function to get round number from match label
  const getRoundFromLabel = (label: string): number => {
    const match = label.match(/ROUND (\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  // Organize matches by branch (A or B)
  const branchesData = useMemo(() => {
    const branchA: TournamentMatch[] = [];
    const branchB: TournamentMatch[] = [];

    matches.forEach(match => {
      if (match.label.includes('LOSERS A')) {
        branchA.push(match);
      } else if (match.label.includes('LOSERS B')) {
        branchB.push(match);
      }
    });

    // Organize Branch A by rounds
    const branchARounds = branchA.reduce((acc, match) => {
      const roundNum = getRoundFromLabel(match.label);
      if (!acc[roundNum]) {
        acc[roundNum] = [];
      }
      acc[roundNum].push(match);
      return acc;
    }, {} as Record<number, TournamentMatch[]>);

    // Organize Branch B by rounds
    const branchBRounds = branchB.reduce((acc, match) => {
      const roundNum = getRoundFromLabel(match.label);
      if (!acc[roundNum]) {
        acc[roundNum] = [];
      }
      acc[roundNum].push(match);
      return acc;
    }, {} as Record<number, TournamentMatch[]>);

    const branches: BranchData[] = [
      {
        name: 'Nhánh A',
        subtitle: '8 players từ Winners Round 1',
        rounds: Object.entries(branchARounds).map(([roundNum, roundMatches]) => ({
          roundNumber: parseInt(roundNum),
          roundName: `LOSERS A ROUND ${roundNum}`,
          matches: roundMatches
        }))
      },
      {
        name: 'Nhánh B', 
        subtitle: '4 players từ Winners Round 2',
        rounds: Object.entries(branchBRounds).map(([roundNum, roundMatches]) => ({
          roundNumber: parseInt(roundNum),
          roundName: `LOSERS B ROUND ${roundNum}`,
          matches: roundMatches
        }))
      }
    ];

    return branches;
  }, [matches]);

  const handleMatchPress = (match: TournamentMatch) => {
    onMatchPress?.(match);
  };

  const renderBranch = (branch: BranchData, branchIndex: number) => (
    <View key={branchIndex} style={styles.branchContainer}>
      {/* Branch Header */}
      <View style={styles.branchHeader}>
        <Text style={[styles.branchTitle, { color: theme.colors.sabo.primary[600] }]}>
          {branch.name}
        </Text>
        <Text style={[styles.branchSubtitle, { color: theme.colors.sabo.primary[400] }]}>
          {branch.subtitle}
        </Text>
      </View>

      {/* Branch Rounds */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roundsContainer}
      >
        {branch.rounds.map((round, roundIndex) => (
          <View key={roundIndex} style={styles.roundColumn}>
            <Text style={[styles.roundTitle, { color: theme.colors.sabo.secondary[600] }]}>
              ROUND {round.roundNumber}
            </Text>
            <Text style={[styles.roundSubtitle, { color: theme.colors.sabo.primary[300] }]}>
              {round.matches.length} matches
            </Text>
            
            {round.matches.map((match) => (
              <View key={match.id} style={styles.matchWrapper}>
                <MatchCard 
                  match={match}
                  onMatchPress={() => handleMatchPress(match)}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (branchesData.every(branch => branch.rounds.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.sabo.primary[500] }]}>
          Nhánh thua sẽ bắt đầu khi có losers từ Winners' Bracket
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.light.background }]}
      showsVerticalScrollIndicator={false}
    >
      {branchesData.map((branch, index) => renderBranch(branch, index))}
      
      {/* Final Stage Info */}
      <View style={styles.finalStageInfo}>
        <Text style={[styles.finalStageTitle, { color: theme.colors.sabo.primary[600] }]}>
          Giai đoạn cuối
        </Text>
        <Text style={[styles.finalStageText, { color: theme.colors.sabo.primary[500] }]}>
          Champions từ Nhánh A và Nhánh B sẽ đấu với nhau hoặc với Winners' Bracket
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  branchContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  branchHeader: {
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(123, 92, 246, 0.1)',
  },
  branchTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  branchSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  roundsContainer: {
    paddingRight: 20,
  },
  roundColumn: {
    width: 280,
    marginRight: 20,
  },
  roundTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roundSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchWrapper: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  finalStageInfo: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(123, 92, 246, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#7B5CF6',
  },
  finalStageTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  finalStageText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});