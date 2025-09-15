import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { RankBadge } from '@/components/shared';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: string;
}

export interface MatchScore {
  player1: number;
  player2: number;
}

export interface GameInfo {
  handicap: string;
  table: string;
  raceType: string;
}

export interface TournamentMatch {
  id: string;
  label: string;
  player1: Player | null;
  player2: Player | null;
  score: MatchScore | null;
  gameInfo: GameInfo;
  nextMatchId?: string;
  status: 'completed' | 'in_progress' | 'pending';
  winner?: Player;
}

interface MatchCardProps {
  match: TournamentMatch;
  onMatchPress?: (match: TournamentMatch) => void;
  isHighlighted?: boolean;
}

export function MatchCard({ match, onMatchPress, isHighlighted }: MatchCardProps) {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (match.status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const isWinner = (player: Player | null) => {
    if (!player || !match.winner) return false;
    return player.id === match.winner.id;
  };

  return (
    <TouchableOpacity
      style={[
        styles.matchCard,
        {
          backgroundColor: theme.colorStyle('light.surface'),
          borderColor: isHighlighted ? theme.colorStyle('sabo.primary.500') : theme.colorStyle('light.border'),
          borderWidth: isHighlighted ? 2 : 1,
        }
      ]}
      onPress={() => onMatchPress?.(match)}
      activeOpacity={0.7}
    >
      {/* Match Status Indicator */}
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      
      {/* Players Section */}
      <View style={styles.playersSection}>
        {/* Player 1 */}
        <View style={[
          styles.playerRow,
          isWinner(match.player1) && styles.winnerRow
        ]}>
          <View style={styles.playerInfo}>
            {match.player1 ? (
              <>
                <Image
                  source={{ uri: match.player1.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.playerDetails}>
                  <Text style={[
                    styles.playerName,
                    { color: theme.colorStyle('light.text') },
                    isWinner(match.player1) && styles.winnerText
                  ]}>
                    {match.player1.name}
                  </Text>
                  <RankBadge rank={match.player1.rank} size="sm" />
                </View>
              </>
            ) : (
              <View style={styles.emptyPlayer}>
                <View style={styles.emptyAvatar} />
                <Text style={[styles.emptyPlayerText, { color: theme.colorStyle('light.textSecondary') }]}>
                  Chờ đối thủ
                </Text>
              </View>
            )}
          </View>
          
          {/* Score */}
          {match.score && (
            <Text style={[
              styles.score,
              { color: theme.colorStyle('light.text') },
              isWinner(match.player1) && styles.winnerScore
            ]}>
              {match.score.player1}
            </Text>
          )}
        </View>

        {/* VS Divider */}
        <View style={styles.vsDivider}>
          <Text style={[styles.vsText, { color: theme.colorStyle('light.textSecondary') }]}>
            vs
          </Text>
          {match.score && (
            <Text style={[styles.scoreVs, { color: theme.colorStyle('light.textSecondary') }]}>
              -
            </Text>
          )}
        </View>

        {/* Player 2 */}
        <View style={[
          styles.playerRow,
          isWinner(match.player2) && styles.winnerRow
        ]}>
          <View style={styles.playerInfo}>
            {match.player2 ? (
              <>
                <Image
                  source={{ uri: match.player2.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.playerDetails}>
                  <Text style={[
                    styles.playerName,
                    { color: theme.colorStyle('light.text') },
                    isWinner(match.player2) && styles.winnerText
                  ]}>
                    {match.player2.name}
                  </Text>
                  <RankBadge rank={match.player2.rank} size="sm" />
                </View>
              </>
            ) : (
              <View style={styles.emptyPlayer}>
                <View style={styles.emptyAvatar} />
                <Text style={[styles.emptyPlayerText, { color: theme.colorStyle('light.textSecondary') }]}>
                  Chờ đối thủ
                </Text>
              </View>
            )}
          </View>
          
          {/* Score */}
          {match.score && (
            <Text style={[
              styles.score,
              { color: theme.colorStyle('light.text') },
              isWinner(match.player2) && styles.winnerScore
            ]}>
              {match.score.player2}
            </Text>
          )}
        </View>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <Text style={[
          styles.matchLabel,
          { color: theme.colorStyle('sabo.primary.500') }
        ]}>
          {match.label}
        </Text>
        
        <View style={styles.gameDetails}>
          <Text style={[styles.gameDetailText, { color: theme.colorStyle('light.textSecondary') }]}>
            {match.gameInfo.handicap} • {match.gameInfo.table}
          </Text>
          <Text style={[styles.gameDetailText, { color: theme.colorStyle('light.textSecondary') }]}>
            {match.gameInfo.raceType}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  matchCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  playersSection: {
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  winnerRow: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginHorizontal: -4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  emptyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  playerDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  winnerText: {
    fontWeight: '700',
    color: '#22c55e',
  },
  emptyPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyPlayerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  winnerScore: {
    color: '#22c55e',
  },
  vsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  vsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreVs: {
    fontSize: 16,
    fontWeight: '600',
  },
  matchInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gameDetails: {
    gap: 2,
  },
  gameDetailText: {
    fontSize: 10,
    fontWeight: '500',
  },
});