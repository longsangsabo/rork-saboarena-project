import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email');
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      console.log('Vui lòng nhập email');
      return;
    }

    // Navigate to verification screen or show success message
    console.log('Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn');
    router.push('/login-screen');
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <View style={styles.passwordIcon}>
            <View style={styles.lockBody} />
            <View style={styles.lockShackle} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Đặt lại mật khẩu của bạn</Text>
        <Text style={styles.subtitle}>
          Nhập Email hoặc SDT của bạn và SABO sẽ gửi bạn hướng dẫn !
        </Text>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
            onPress={() => setActiveTab('phone')}
          >
            <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>Số điện thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'email' && styles.activeTab]}
            onPress={() => setActiveTab('email')}
          >
            <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.resetButtonText}>Xác minh Số điện thoại</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  illustration: {
    width: 200,
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordIcon: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  lockBody: {
    width: 40,
    height: 30,
    backgroundColor: '#666',
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 10,
  },
  lockShackle: {
    width: 30,
    height: 30,
    borderWidth: 6,
    borderColor: '#666',
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 15,
    borderBottomWidth: 0,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
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
    color: '#666',
  },
  activeTabText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  resetButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});