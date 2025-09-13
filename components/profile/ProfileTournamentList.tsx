import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Calendar, Users, DollarSign } from 'lucide-react-native';

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
  const tabs = [
    { key: 'ready' as const, label: 'Sẵn sàng' },
    { key: 'live' as const, label: 'Đang live' },
    { key: 'done' as const, label: 'Hoàn thành' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  return (
    <View style={styles.tournamentSection}>
      <Text style={styles.sectionTitle}>Giải đấu</Text>
      
      {/* Tournament Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tournament List */}
      <ScrollView style={styles.tournamentList} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0A5C6D" />
            <Text style={styles.loadingText}>Đang tải giải đấu...</Text>
          </View>
        ) : tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TouchableOpacity key={tournament.id} style={styles.tournamentItem}>
              <Text style={styles.tournamentTitle}>{tournament.title}</Text>
              <View style={styles.tournamentDetails}>
                <View style={styles.tournamentDetailItem}>
                  <Calendar size={11} color="#0A5C6D" />
                  <Text style={styles.tournamentDetailText}>{tournament.date}</Text>
                </View>
                <View style={styles.tournamentActions}>
                  <View style={styles.tournamentStats}>
                    <Users size={14} color="#801515" />
                    <Text style={styles.tournamentStatsText}>{tournament.participants}/{tournament.max_participants}</Text>
                    <DollarSign size={14} color="#801515" />
                    <Text style={styles.tournamentStatsText}>{formatCurrency(tournament.prize_pool)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có giải đấu nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tournamentSection: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#0A5C6D',
  },
  tournamentList: {
    maxHeight: 300,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  tournamentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  tournamentDetailText: {
    fontSize: 12,
    color: '#0A5C6D',
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
  tournamentStatsText: {
    fontSize: 12,
    color: '#801515',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});