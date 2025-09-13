import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Home, 
  Users, 
  Trophy, 
  Target, 
  User 
} from 'lucide-react-native';

interface FeatureStatus {
  name: string;
  status: 'active' | 'partial' | 'pending';
  description: string;
}

const tabFeatures: Record<string, FeatureStatus[]> = {
  'Trang chủ': [
    { name: 'Social Feed', status: 'active', description: 'Hiển thị feed với tương tác like, comment, share' },
    { name: 'Profile Navigation', status: 'active', description: 'Điều hướng đến trang profile' },
    { name: 'Club Navigation', status: 'active', description: 'Điều hướng đến trang club' },
    { name: 'Play Now Action', status: 'active', description: 'Tạo thách đấu ngay lập tức' },
    { name: 'Schedule Match', status: 'partial', description: 'Đặt lịch chơi (UI hoàn thành)' },
    { name: 'Real-time Updates', status: 'active', description: 'Cập nhật số liệu thời gian thực' }
  ],
  'Tìm đối': [
    { name: 'Challenge Creation', status: 'active', description: 'Tạo thách đấu giao lưu/thách đấu' },
    { name: 'Tab Switching', status: 'active', description: 'Chuyển đổi giữa Giao lưu và Thách đấu' },
    { name: 'Social Interactions', status: 'active', description: 'Like, comment, share challenges' },
    { name: 'Live Challenge Feed', status: 'partial', description: 'Hiển thị danh sách thách đấu' },
    { name: 'Match Scheduling', status: 'active', description: 'Lên lịch trận đấu' }
  ],
  'Giải đấu': [
    { name: 'Tournament List', status: 'active', description: 'Danh sách giải đấu với filter' },
    { name: 'Tournament Registration', status: 'active', description: 'Đăng ký tham gia giải đấu' },
    { name: 'Status Filtering', status: 'active', description: 'Lọc theo trạng thái (Sắp diễn ra, Live, Hoàn thành)' },
    { name: 'Prize Pool Display', status: 'active', description: 'Hiển thị giải thưởng và phí tham gia' },
    { name: 'Player Count', status: 'active', description: 'Số lượng người chơi hiện tại/tối đa' },
    { name: 'Payment Integration', status: 'pending', description: 'Tích hợp thanh toán VNPAY' }
  ],
  'Club': [
    { name: 'Club Profile', status: 'active', description: 'Thông tin chi tiết club' },
    { name: 'Member List', status: 'active', description: 'Danh sách thành viên với trạng thái online' },
    { name: 'Club Statistics', status: 'active', description: 'Thống kê thành viên, giải đấu, prize pool' },
    { name: 'Tab Navigation', status: 'active', description: 'Chuyển đổi giữa các tab nội dung' },
    { name: 'Location Display', status: 'active', description: 'Hiển thị địa chỉ club' },
    { name: 'Photo Upload', status: 'partial', description: 'Thay đổi ảnh club (UI sẵn sàng)' }
  ],
  'Hồ sơ': [
    { name: 'User Profile', status: 'active', description: 'Thông tin cá nhân với ELO, SPA, ranking' },
    { name: 'Tournament History', status: 'active', description: 'Lịch sử giải đấu theo tab Ready/Live/Done' },
    { name: 'Statistics Display', status: 'active', description: 'Hiển thị ELO, SPA, XH, số trận' },
    { name: 'Profile Editing', status: 'partial', description: 'Chỉnh sửa thông tin (UI sẵn sàng)' },
    { name: 'Avatar Management', status: 'active', description: 'Hiển thị avatar với gradient border' },
    { name: 'Settings Menu', status: 'partial', description: 'Menu tùy chọn và đăng xuất' }
  ]
};

export default function FeatureAuditScreen() {
  const getStatusIcon = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="#10B981" />;
      case 'partial':
        return <Clock size={16} color="#F59E0B" />;
      case 'pending':
        return <AlertCircle size={16} color="#EF4444" />;
    }
  };

  const getStatusColor = (status: FeatureStatus['status']) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'partial':
        return '#F59E0B';
      case 'pending':
        return '#EF4444';
    }
  };

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'Trang chủ':
        return <Home size={20} color="#FF004F" />;
      case 'Tìm đối':
        return <Target size={20} color="#FF004F" />;
      case 'Giải đấu':
        return <Trophy size={20} color="#FF004F" />;
      case 'Club':
        return <Users size={20} color="#FF004F" />;
      case 'Hồ sơ':
        return <User size={20} color="#FF004F" />;
      default:
        return null;
    }
  };

  const totalFeatures = Object.values(tabFeatures).flat().length;
  const activeFeatures = Object.values(tabFeatures).flat().filter(f => f.status === 'active').length;
  const partialFeatures = Object.values(tabFeatures).flat().filter(f => f.status === 'partial').length;
  const pendingFeatures = Object.values(tabFeatures).flat().filter(f => f.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 SABO Arena - Feature Audit</Text>
          <Text style={styles.subtitle}>Tổng quan tính năng đã kích hoạt</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalFeatures}</Text>
            <Text style={styles.summaryLabel}>Tổng tính năng</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#10B981' }]}>
            <Text style={[styles.summaryNumber, { color: 'white' }]}>{activeFeatures}</Text>
            <Text style={[styles.summaryLabel, { color: 'white' }]}>Đã kích hoạt</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#F59E0B' }]}>
            <Text style={[styles.summaryNumber, { color: 'white' }]}>{partialFeatures}</Text>
            <Text style={[styles.summaryLabel, { color: 'white' }]}>Một phần</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#EF4444' }]}>
            <Text style={[styles.summaryNumber, { color: 'white' }]}>{pendingFeatures}</Text>
            <Text style={[styles.summaryLabel, { color: 'white' }]}>Chờ xử lý</Text>
          </View>
        </View>

        {/* Feature Details by Tab */}
        {Object.entries(tabFeatures).map(([tabName, features]) => (
          <View key={tabName} style={styles.tabSection}>
            <View style={styles.tabHeader}>
              {getTabIcon(tabName)}
              <Text style={styles.tabTitle}>{tabName}</Text>
              <View style={styles.tabStats}>
                <Text style={styles.tabStatsText}>
                  {features.filter(f => f.status === 'active').length}/{features.length}
                </Text>
              </View>
            </View>
            
            <View style={styles.featureList}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureHeader}>
                    {getStatusIcon(feature.status)}
                    <Text style={styles.featureName}>{feature.name}</Text>
                  </View>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Backend Integration Status */}
        <View style={styles.backendSection}>
          <Text style={styles.backendTitle}>🔧 Backend Integration</Text>
          <View style={styles.backendList}>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>tRPC API Routes - Hoàn thành</Text>
            </View>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>User Profile Service - Hoạt động</Text>
            </View>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>Tournament Management - Hoạt động</Text>
            </View>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>Club Management - Hoạt động</Text>
            </View>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>Challenge System - Hoạt động</Text>
            </View>
            <View style={styles.backendItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.backendText}>Social Feed - Hoạt động</Text>
            </View>
            <View style={styles.backendItem}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.backendText}>Payment Integration - Đang phát triển</Text>
            </View>
            <View style={styles.backendItem}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.backendText}>Real-time WebSocket - Đang phát triển</Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.nextStepsTitle}>🚀 Bước tiếp theo</Text>
          <View style={styles.nextStepsList}>
            <Text style={styles.nextStepItem}>• Tích hợp thanh toán VNPAY cho tournament entry</Text>
            <Text style={styles.nextStepItem}>• Thêm WebSocket cho cập nhật real-time</Text>
            <Text style={styles.nextStepItem}>• Hoàn thiện tính năng upload ảnh</Text>
            <Text style={styles.nextStepItem}>• Thêm push notifications</Text>
            <Text style={styles.nextStepItem}>• Tối ưu hóa performance và offline support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tabSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tabStats: {
    backgroundColor: '#FF004F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabStatsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureList: {
    padding: 16,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 24,
  },
  backendSection: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  backendList: {
    gap: 12,
  },
  backendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  nextStepsSection: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 40,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 8,
  },
  nextStepItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});