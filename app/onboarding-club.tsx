import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const clubOnboardingData = [
  {
    id: 1,
    title: 'CHUYỂN ĐỔI SỐ CHO\nCLB CỦA BẠN !!',
    description: 'SABO liên tục phát triển tính năng giúp bạn chỉ cần sử dụng nền tảng là đã giản tiếp chuyển đổi số cho CLB của mình !!',
    bottomText: 'Đừng để CLB của bạn bị hố lại phía sau trong thị trường cạnh tranh như hiện tại !!',
    illustration: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', // Digital transformation illustration
    backgroundColor: '#F8F9FA',
  },
  {
    id: 2,
    title: 'KẾT NỐI CỘNG ĐỒNG\nCÓ CÙNG SỞ THÍCH BIDA !!',
    description: 'SABO có nhiều tính năng giúp CLB kết nối trực tiếp đến người chơi bida mà không cần bạn phải chi quá nhiều chi phí cho quảng cáo!',
    bottomText: 'Người chơi khi đã được xác minh hạng sẽ được tham gia mọi giải đấu tại các CLB có sử dụng nền tảng. Giúp CLB của bạn thu hút khách hàng mới ở khắp mọi nơi.',
    illustration: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Community connection illustration
    backgroundColor: '#F8F9FA',
  },
  {
    id: 3,
    title: 'TỔ CHỨC GIẢI ĐẤU\nDỄ DÀNG !!',
    description: 'SABO giúp bạn tổ chức, quản lý, quảng bá các giải đấu cấp CLB một cách dễ dàng, thuận lợi và tối ưu mọi chi phí !!',
    illustration: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', // Tournament management illustration
    backgroundColor: '#F8F9FA',
  },
  {
    id: 4,
    title: 'THU HÚT & GIỮ CHÂN\nTHÀNH VIÊN !!',
    description: 'Thành viên CLB có cơ hội thi đấu thường xuyên, có lộ trình năng hạng rõ ràng\n\nCác cơ thủ sẽ cảm thấy gắn bó hơn vì được cập nhật bằng xếp hạng chung, không chỉ chơi tại CLB !!',
    illustration: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', // Member retention illustration
    backgroundColor: '#F8F9FA',
  },
  {
    id: 5,
    title: 'TỐI ƯU CHI PHÍ MARKETING\n& QUẢNG CÁO !',
    description: 'Sử dụng nền tảng SABO sẽ giúp bạn không phải tốn quá nhiều công sức, chi phí cho việc thiết kế poster, bài post, marketing và quảng cáo mà vẫn giúp CLB tiếp cận được cộng đồng người chơi bida !!',
    boldText: 'VÀ RẤT NHIỀU TÍNH NĂNG HẤP DẪN\nKHÁC ĐANG ĐỢI BẠN KHÁM PHÁ !!',
    illustration: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', // Marketing optimization illustration
    backgroundColor: '#F8F9FA',
  }
];

export default function OnboardingClubScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < clubOnboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to club registration or main app
      router.replace('/register-club');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/register-club');
  };

  const handleGetStarted = () => {
    router.replace('/register-club');
  };

  const currentData = clubOnboardingData[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentData.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentData.backgroundColor} />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>
          {currentIndex === clubOnboardingData.length - 1 ? 'Bắt đầu' : 'Bỏ qua'}
        </Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Illustration */}
        {currentData.illustration && (
          <View style={styles.illustrationContainer}>
            <Image 
              source={{ uri: currentData.illustration }} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        )}
        
        {/* Title */}
        <Text style={styles.title}>{currentData.title}</Text>
        
        {/* Description */}
        <Text style={styles.description}>{currentData.description}</Text>
        
        {/* Bottom Text */}
        {currentData.bottomText && (
          <Text style={styles.bottomText}>{currentData.bottomText}</Text>
        )}
        
        {/* Bold Text */}
        {currentData.boldText && (
          <Text style={styles.boldText}>{currentData.boldText}</Text>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonLeft, currentIndex === 0 && styles.navButtonDisabled]} 
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.pagination}>
          {clubOnboardingData.map((_, index) => (
            <View 
              key={`dot-${index}`} 
              style={[styles.dot, index === currentIndex && styles.activeDot]} 
            />
          ))}
        </View>
        
        <TouchableOpacity style={[styles.navButton, styles.navButtonRight]} onPress={handleNext}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#4A5D23',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 120,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.35,
  },
  illustration: {
    width: width * 0.8,
    height: '100%',
    maxWidth: 300,
    maxHeight: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1a1a',
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666666',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  bottomText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666666',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    color: '#1a1a1a',
    marginTop: 24,
    paddingHorizontal: 10,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A5D23',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonLeft: {
    // Specific styles for left button if needed
  },
  navButtonRight: {
    // Specific styles for right button if needed
  },
  navButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  navButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#cccccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4A5D23',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});