import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { ArrowLeft, Database, Plus, Trash2, RefreshCw } from 'lucide-react-native';

const supabaseUrl = 'https://skzirkhzwhyqmnfyytcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremlya2h6d2h5cW1uZnl5dGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDM3MzUsImV4cCI6MjA3MzMxOTczNX0._0Ic0SL4FZVMennTXmOzIp2KBOCwRagpbRXaWhZJI24';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestConnectionScreen() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);
      
      console.log('🔍 Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('tournaments')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Connection test failed:', error);
        setConnectionStatus('error');
        setError(error.message);
        return;
      }
      
      console.log('✅ Supabase connection successful');
      setConnectionStatus('connected');
      
      // Load existing tournaments
      await loadTournaments();
      
    } catch (err) {
      console.error('❌ Connection error:', err);
      setConnectionStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const loadTournaments = async () => {
    try {
      setLoading(true);
      console.log('📋 Loading tournaments from database...');
      
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error loading tournaments:', error);
        setError(error.message);
        return;
      }
      
      console.log('✅ Loaded tournaments:', data?.length || 0);
      setTournaments(data || []);
      
    } catch (err) {
      console.error('❌ Load error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createSampleTournaments = async () => {
    try {
      setLoading(true);
      console.log('🎯 Creating sample tournaments...');
      
      const sampleTournaments = [
        {
          name: 'SABO Championship 2025',
          description: 'Giải đấu bi-a lớn nhất năm với giải thưởng hấp dẫn',
          max_participants: 32,
          entry_fee: 200000,
          total_prize: 50000000,
          status: 'registration_open',
          start_time: new Date('2025-09-20T09:00:00Z').toISOString(),
          registration_deadline: new Date('2025-09-18T23:59:59Z').toISOString(),
          created_at: new Date().toISOString()
        },
        {
          name: 'Weekly Tournament',
          description: 'Giải đấu hàng tuần cho mọi trình độ',
          max_participants: 16,
          entry_fee: 50000,
          total_prize: 5000000,
          status: 'in_progress',
          start_time: new Date('2025-09-16T19:00:00Z').toISOString(),
          registration_deadline: new Date('2025-09-15T23:59:59Z').toISOString(),
          created_at: new Date().toISOString()
        },
        {
          name: 'Beginner Friendly Cup',
          description: 'Dành cho người mới chơi, không áp lực',
          max_participants: 16,
          entry_fee: 30000,
          total_prize: 1000000,
          status: 'completed',
          start_time: new Date('2025-09-15T14:00:00Z').toISOString(),
          registration_deadline: new Date('2025-09-14T23:59:59Z').toISOString(),
          created_at: new Date().toISOString()
        }
      ];
      
      const { data, error } = await supabase
        .from('tournaments')
        .insert(sampleTournaments)
        .select();
      
      if (error) {
        console.error('❌ Error creating tournaments:', error);
        Alert.alert('Lỗi', `Không thể tạo giải đấu mẫu: ${error.message}`);
        return;
      }
      
      console.log('✅ Created sample tournaments:', data?.length || 0);
      Alert.alert('Thành công', `Đã tạo ${data?.length || 0} giải đấu mẫu`);
      
      // Reload tournaments
      await loadTournaments();
      
    } catch (err) {
      console.error('❌ Create error:', err);
      Alert.alert('Lỗi', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const clearAllTournaments = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa tất cả giải đấu?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('🗑️ Clearing all tournaments...');
              
              const { error } = await supabase
                .from('tournaments')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except non-existent ID
              
              if (error) {
                console.error('❌ Error clearing tournaments:', error);
                Alert.alert('Lỗi', `Không thể xóa: ${error.message}`);
                return;
              }
              
              console.log('✅ All tournaments cleared');
              Alert.alert('Thành công', 'Đã xóa tất cả giải đấu');
              
              // Reload tournaments
              await loadTournaments();
              
            } catch (err) {
              console.error('❌ Clear error:', err);
              Alert.alert('Lỗi', err instanceof Error ? err.message : 'Unknown error');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open': return '#3B82F6';
      case 'in_progress': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration_open': return 'Đang mở đăng ký';
      case 'in_progress': return 'Đang diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Database Connection</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái kết nối</Text>
          <View style={[
            styles.statusCard,
            { backgroundColor: connectionStatus === 'connected' ? '#DCFCE7' : connectionStatus === 'error' ? '#FEE2E2' : '#FEF3C7' }
          ]}>
            <Database 
              size={24} 
              color={connectionStatus === 'connected' ? '#16A34A' : connectionStatus === 'error' ? '#DC2626' : '#D97706'} 
            />
            <View style={styles.statusInfo}>
              <Text style={[
                styles.statusText,
                { color: connectionStatus === 'connected' ? '#16A34A' : connectionStatus === 'error' ? '#DC2626' : '#D97706' }
              ]}>
                {connectionStatus === 'connected' ? 'Kết nối thành công' : 
                 connectionStatus === 'error' ? 'Lỗi kết nối' : 'Đang kiểm tra...'}
              </Text>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={testConnection}
              disabled={loading}
            >
              <RefreshCw size={20} color="white" />
              <Text style={styles.primaryButtonText}>Kiểm tra lại</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.successButton]} 
              onPress={createSampleTournaments}
              disabled={loading || connectionStatus !== 'connected'}
            >
              <Plus size={20} color="white" />
              <Text style={styles.primaryButtonText}>Tạo dữ liệu mẫu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={clearAllTournaments}
              disabled={loading || connectionStatus !== 'connected'}
            >
              <Trash2 size={20} color="white" />
              <Text style={styles.primaryButtonText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tournament List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giải đấu trong database ({tournaments.length})</Text>
          {loading ? (
            <Text style={styles.loadingText}>Đang tải...</Text>
          ) : tournaments.length > 0 ? (
            tournaments.map((tournament, index) => (
              <View key={tournament.id || index} style={styles.tournamentCard}>
                <View style={styles.tournamentHeader}>
                  <Text style={styles.tournamentName}>{tournament.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(tournament.status) }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(tournament.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tournamentDescription}>{tournament.description}</Text>
                <View style={styles.tournamentStats}>
                  <Text style={styles.statText}>Tối đa: {tournament.max_participants} người</Text>
                  <Text style={styles.statText}>Phí: {tournament.entry_fee?.toLocaleString('vi-VN')}đ</Text>
                  <Text style={styles.statText}>Giải thưởng: {tournament.total_prize?.toLocaleString('vi-VN')}đ</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Chưa có giải đấu nào trong database</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontStyle: 'italic',
    padding: 20,
  },
  tournamentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  tournamentDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  tournamentStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#374151',
  },
});