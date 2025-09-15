import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, Phone, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, loading, error } = useAuth();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log('🔐 Login button pressed');
    
    if (activeTab === 'phone' && !formData.phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (activeTab === 'email' && !formData.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    if (!formData.password) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔐 Starting login process...');
      
      // For now, use email for both phone and email login
      // In production, you would handle phone authentication differently
      const loginEmail = activeTab === 'email' ? formData.email : `${formData.phone}@sabo.arena`;
      console.log('🔐 Login email:', loginEmail);
      
      await signIn(loginEmail, formData.password);
      console.log('🔐 Login successful!');
      
      // Navigate directly without alert for better UX
      router.replace('/(tabs)/home');
      
    } catch (error: any) {
      console.error('🔐 Login error:', error);
      Alert.alert(
        'Lỗi đăng nhập', 
        error.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Thông báo', `Đăng nhập bằng ${provider} đang được phát triển`);
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const goToForgotPassword = () => {
    router.push('/forgot-password');
  };

  const fillDemoAccount = () => {
    setFormData({
      ...formData,
      email: 'test@example.com',
      password: '123456'
    });
    setActiveTab('email');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Chào mừng trở lại !</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục khám phá</Text>
        
        {/* Demo Account Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>🎮 Tài khoản Demo</Text>
          <Text style={styles.demoText}>Email: test@example.com</Text>
          <Text style={styles.demoText}>Mật khẩu: 123456</Text>
          <TouchableOpacity style={styles.demoButton} onPress={fillDemoAccount}>
            <Text style={styles.demoButtonText}>Tự động điền</Text>
          </TouchableOpacity>
        </View>
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
        {/* Phone or Email */}
        {activeTab === 'phone' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đăng nhập bằng SDT</Text>
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
            <View style={styles.lockIcon}>
              <View style={styles.lockBody} />
              <View style={styles.lockShackle} />
            </View>
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

        {/* Remember Me & Forgot Password */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Ghi nhớ tôi</Text>
          <TouchableOpacity style={styles.forgotPassword} onPress={goToForgotPassword}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, (isLoading || loading) && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading || loading}
          activeOpacity={0.8}
          testID="login-button"
        >
          <Text style={styles.loginButtonText}>
            {isLoading || loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Text>
        </TouchableOpacity>
        
        {/* Debug Button */}
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: '#FF6B6B', marginTop: 10 }]} 
          onPress={() => {
            console.log('🔴 Debug button pressed');
            console.log('Form data:', formData);
            console.log('Active tab:', activeTab);
            console.log('Loading states:', { isLoading, loading });
          }}
        >
          <Text style={styles.loginButtonText}>Debug Info</Text>
        </TouchableOpacity>

        {/* Social Login */}
        <Text style={styles.orText}>Bạn có thể Kết nối với</Text>
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

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Bạn chưa có tài khoản u ? </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.registerLink}>Đăng ký đây!!!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  demoInfo: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#4A5D23',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5D23',
    textAlign: 'center',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#4A5D23',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  demoButton: {
    backgroundColor: '#4A5D23',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'center',
  },
  demoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
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
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  lockIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    position: 'relative',
  },
  lockBody: {
    width: 12,
    height: 8,
    backgroundColor: '#999',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    left: 4,
  },
  lockShackle: {
    width: 8,
    height: 8,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    left: 6,
    borderBottomWidth: 0,
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
    marginBottom: 30,
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
  loginButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 30,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
});