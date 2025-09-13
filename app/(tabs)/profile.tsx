import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Settings, 
  Edit3, 
  Star 
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCurrentUser } from '@/providers/SABODataProvider';
import { formatNumber, getRankByElo } from '@/types/sabo';

export default function ProfileScreen() {
  const { currentUser, userStats, isAuthenticated } = useCurrentUser();

  if (!isAuthenticated || !currentUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  const rank = getRankByElo(currentUser.elo);
  const winRate = currentUser.total_matches > 0 ? (currentUser.wins / currentUser.total_matches) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <Image 
                source={{ uri: currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }} 
                style={styles.avatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <View style={styles.rankContainer}>
                  <Text style={[styles.rankIcon, { color: rank.color }]}>{rank.icon}</Text>
                  <Text style={[styles.rankName, { color: rank.color }]}>{rank.name}</Text>
                  <Text style={styles.eloText}>ELO: {currentUser.elo}</Text>
                </View>
                <Text style={styles.email}>{currentUser.email}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={20} color={Colors.light.tint} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Trophy size={24} color={Colors.sabo.secondary[500]} />
            </View>
            <Text style={styles.statValue}>{currentUser.ranking_position}</Text>
            <Text style={styles.statLabel}>Xếp hạng</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Target size={24} color={Colors.light.tint} />
            </View>
            <Text style={styles.statValue}>{formatNumber(currentUser.spa_points)}</Text>
            <Text style={styles.statLabel}>SPA Points</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={24} color={Colors.sabo.primary[500]} />
            </View>
            <Text style={styles.statValue}>{winRate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Tỉ lệ thắng</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Calendar size={24} color={Colors.sabo.secondary[600]} />
            </View>
            <Text style={styles.statValue}>{currentUser.total_matches}</Text>
            <Text style={styles.statLabel}>Tổng trận</Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê chi tiết</Text>
          
          <View style={styles.detailStatsContainer}>
            <View style={styles.detailStatRow}>
              <Text style={styles.detailStatLabel}>Trận thắng</Text>
              <Text style={[styles.detailStatValue, { color: Colors.sabo.primary[600] }]}>{currentUser.wins}</Text>
            </View>
            
            <View style={styles.detailStatRow}>
              <Text style={styles.detailStatLabel}>Trận thua</Text>
              <Text style={[styles.detailStatValue, { color: '#EF4444' }]}>{currentUser.losses}</Text>
            </View>
            
            {userStats && (
              <>
                <View style={styles.detailStatRow}>
                  <Text style={styles.detailStatLabel}>Chuỗi thắng hiện tại</Text>
                  <Text style={styles.detailStatValue}>{userStats.current_streak}</Text>
                </View>
                
                <View style={styles.detailStatRow}>
                  <Text style={styles.detailStatLabel}>Chuỗi thắng tốt nhất</Text>
                  <Text style={styles.detailStatValue}>{userStats.best_streak}</Text>
                </View>
                
                <View style={styles.detailStatRow}>
                  <Text style={styles.detailStatLabel}>Giải đấu thắng</Text>
                  <Text style={styles.detailStatValue}>{userStats.tournaments_won}</Text>
                </View>
                
                <View style={styles.detailStatRow}>
                  <Text style={styles.detailStatLabel}>Giải đấu tham gia</Text>
                  <Text style={styles.detailStatValue}>{userStats.tournaments_played}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tựu</Text>
          
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementCard}>
              <Award size={32} color={Colors.sabo.secondary[500]} />
              <Text style={styles.achievementTitle}>Thạc sĩ bi-a</Text>
              <Text style={styles.achievementDesc}>Đạt ELO trên 1400</Text>
            </View>
            
            <View style={styles.achievementCard}>
              <Star size={32} color={Colors.sabo.primary[500]} />
              <Text style={styles.achievementTitle}>Người mới</Text>
              <Text style={styles.achievementDesc}>Hoàn thành 10 trận đầu</Text>
            </View>
            
            <View style={styles.achievementCard}>
              <Trophy size={32} color={Colors.sabo.secondary[600]} />
              <Text style={styles.achievementTitle}>Nhà vô địch</Text>
              <Text style={styles.achievementDesc}>Thắng 3 giải đấu</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.light.text} />
            <Text style={styles.settingsText}>Cài đặt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.placeholder,
  },
  header: {
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  rankName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  eloText: {
    fontSize: 14,
    color: Colors.light.placeholder,
  },
  email: {
    fontSize: 14,
    color: Colors.light.placeholder,
  },
  editButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailStatsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailStatLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  settingsText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '600',
  },
});