import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Calendar, Users, DollarSign } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface Tournament {
  id: string;
  title: string;
  date: string;
  participants: number;
  max_participants: number;
  prize_pool: number;
  status: string;
}

interface ProfileTournamentListProps {
  tournaments: Tournament[];
  isLoading: boolean;
  activeTab: 'ready' | 'live' | 'done';
  onTabChange: (tab: 'ready' | 'live' | 'done') => void;
}

export const ProfileTournamentList: React.FC<ProfileTournamentListProps> = ({
  tournaments,
  isLoading,
  activeTab,
  onTabChange
}) => {
  const theme = useTheme();
  const tabs = [
    { key: 'ready' as const, label: 'Sẵn sàng' },
    { key: 'live' as const, label: 'Đang live' },
    { key: 'done' as const, label: 'Hoàn thành' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  return (
    <View style={[
      styles.tournamentSection,
      {
        backgroundColor: theme.colorStyle('light.background'),
        marginTop: theme.spacingStyle('xl'), // 20px
        padding: theme.spacingStyle('xl'),
      }
    ]}>
      <Text style={[
        theme.fontStyle('h3'),
        {
          color: theme.colorStyle('light.text'),
          marginBottom: theme.spacingStyle('lg'), // 16px
        }
      ]}>
        Giải đấu
      </Text>
      
      {/* Tournament Tabs */}
      <View style={[
        styles.tabContainer,
        {
          backgroundColor: theme.colorStyle('light.card'),
          padding: theme.spacingStyle('xs'), // 4px
          marginBottom: theme.spacingStyle('lg'), // 16px
        }
      ]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                paddingVertical: theme.spacingStyle('sm'), // 8px
                paddingHorizontal: theme.spacingStyle('md'), // 12px
              },
              activeTab === tab.key && {
                backgroundColor: theme.colorStyle('light.background'),
              }
            ]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text style={[
              theme.fontStyle('label'),
              {
                color: activeTab === tab.key 
                  ? theme.colorStyle('sabo.primary.600') 
                  : theme.colorStyle('sabo.gray.500')
              }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tournament List */}
      <ScrollView style={styles.tournamentList} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={[
            styles.loadingContainer,
            { paddingVertical: theme.spacingStyle('xl') } // 20px
          ]}>
            <ActivityIndicator size="small" color={theme.colorStyle('sabo.primary.500')} />
            <Text style={[
              theme.fontStyle('bodySmall'),
              { color: theme.colorStyle('sabo.gray.500') }
            ]}>
              Đang tải giải đấu...
            </Text>
          </View>
        ) : tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TouchableOpacity key={tournament.id} style={[
              styles.tournamentItem,
              {
                paddingVertical: theme.spacingStyle('md'), // 12px
                borderBottomColor: theme.colorStyle('light.border'),
              }
            ]}>
              <Text style={[
                theme.fontStyle('body'),
                {
                  color: theme.colorStyle('light.text'),
                  fontWeight: '600' as const,
                  marginBottom: theme.spacingStyle('sm'), // 8px
                }
              ]}>
                {tournament.title}
              </Text>
              <View style={styles.tournamentDetails}>
                <View style={styles.tournamentDetailItem}>
                  <Calendar size={11} color={theme.colorStyle('sabo.primary.600')} />
                  <Text style={[
                    theme.fontStyle('caption'),
                    { color: theme.colorStyle('sabo.primary.600') }
                  ]}>
                    {tournament.date}
                  </Text>
                </View>
                <View style={styles.tournamentActions}>
                  <View style={styles.tournamentStats}>
                    <Users size={14} color={theme.colorStyle('sabo.error.600')} />
                    <Text style={[
                      theme.fontStyle('caption'),
                      { 
                        color: theme.colorStyle('sabo.error.600'),
                        marginRight: theme.spacingStyle('sm'), // 8px
                      }
                    ]}>
                      {tournament.participants}/{tournament.max_participants}
                    </Text>
                    <DollarSign size={14} color={theme.colorStyle('sabo.error.600')} />
                    <Text style={[
                      theme.fontStyle('caption'),
                      { color: theme.colorStyle('sabo.error.600') }
                    ]}>
                      {formatCurrency(tournament.prize_pool)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[
            styles.emptyContainer,
            { paddingVertical: theme.spacingStyle('4xl') } // 40px
          ]}>
            <Text style={[
              theme.fontStyle('body'),
              { color: theme.colorStyle('sabo.gray.500') }
            ]}>
              Không có giải đấu nào
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tournamentSection: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  tournamentList: {
    maxHeight: 300,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tournamentItem: {
    borderBottomWidth: 1,
  },
  tournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tournamentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tournamentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tournamentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyContainer: {
    alignItems: 'center',
  },
});