import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, Phone, Mail, User, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const { signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email');
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.fullName || !formData.nickname || !formData.password || !formData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (activeTab === 'phone' && !formData.phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (activeTab === 'email' && !formData.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setIsLoading(true);
      
      // For now, use email for both phone and email registration
      const registerEmail = activeTab === 'email' ? formData.email : `${formData.phone}@sabo.arena`;
      
      await signUp(registerEmail, formData.password, formData.nickname);
      
      Alert.alert(
        'Thành công', 
        'Đăng ký tài khoản thành công! Chào mừng bạn đến với SABO Arena.',
        [
          { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Lỗi đăng ký', 
        error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Thông báo', `Đăng nhập bằng ${provider} đang được phát triển`);
  };

  const goToLogin = () => {
    router.push('/login-screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>
              Bạn đã có tài khoản rồi u? <Text style={styles.linkText} onPress={goToLogin}>Đăng nhập ngay !</Text>
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Text style={styles.logoText}>SABO</Text>
              <Text style={styles.logoSubtext}>ARENA</Text>
            </View>
          </View>

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

          <View style={styles.form}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập tên của bạn"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
          </View>
        </View>

        {/* Nickname */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập Nickname của bạn"
              value={formData.nickname}
              onChangeText={(text) => setFormData({...formData, nickname: text})}
            />
          </View>
        </View>

        {/* Phone or Email */}
        {activeTab === 'phone' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        )}

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu của bạn"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Ghi nhớ tôi</Text>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.registerButton, (isLoading || loading) && styles.registerButtonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading || loading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading || loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Text>
        </TouchableOpacity>

        {/* Social Login */}
        <Text style={styles.orText}>Bạn có thể đăng nhập với</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Facebook')}
          >
            <View style={styles.socialIcon}>
              <Text style={styles.socialIconText}>f</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Apple')}
          >
            <View style={[styles.socialIcon, styles.appleIcon]}>
              <Text style={styles.socialIconText}>🍎</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
          >
            <View style={[styles.socialIcon, styles.googleIcon]}>
              <Text style={styles.socialIconText}>G</Text>
            </View>
          </TouchableOpacity>
        </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoBackground: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
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
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPassword: {
    marginLeft: 'auto',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    padding: 4,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleIcon: {
    backgroundColor: '#000',
  },
  googleIcon: {
    backgroundColor: '#DB4437',
  },
  socialIconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});