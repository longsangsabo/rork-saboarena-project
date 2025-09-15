import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const playerOnboardingData = [
  {
    id: 1,
    title: 'TÌM BẠN CHƠI BIDA !!',
    description: 'Bạn muốn chơi bida, nhưng đối của bạn bận cả rồi !!! Hmm..\nĐể SABO tìm đối cần kèo cho bạn nha!!!',
    illustration: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
    backgroundColor: '#F8F9FA',
  },
  {
    id: 2,
    title: 'ĐÁNH GIẢI ĐỂ NÂNG TRÌNH !!',
    description: 'Tham gia các giải đấu phong trào hàng tuần bạn sẽ có cơ hội cọ sát với các cơ thủ cùng trình độ !!\nVà nhận về vô vàn phần quà hấp dẫn !!',
    illustration: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    backgroundColor: '#F8F9FA',
  },
  {
    id: 3,
    title: 'CHẾ ĐỘ THÁCH ĐẤU !!',
    description: 'Chế độ thách đấu giúp bạn giao lưu với các cơ thủ kinh nghiệm, qua đó bạn sẽ có cơ hội học hỏi và cải thiện kỹ năng của mình !!',
    illustration: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop&crop=center',
    backgroundColor: '#F8F9FA',
  },
  {
    id: 4,
    title: 'XẾT HẠNG MINH BẠCH !!',
    description: 'Nói không với bịp hàng , SABO giúp bạn bắt kèo với các cơ thủ cùng trình độ để tăng trải nghiệm chơi bida của bạn !!\n\nCác cơ thủ khi đã được xác minh hạng sẽ được tham gia mọi giải đấu tại các CLB có sử dụng nền tảng.',
    illustration: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=400&fit=crop&crop=center',
    backgroundColor: '#F8F9FA',
  },
  {
    id: 5,
    title: 'LƯU TRỮ THÀNH TÍCH VÀ\nLỊCH SỬ THI ĐẤU !!',
    description: 'SABO giúp lưu trữ lịch sử thi đấu và thành tích chơi bida của bạn, giúp bạn thống kê và theo dõi quá trình tiến bộ của mình !!',
    boldText: 'VÀ RẤT NHIỀU TÍNH NĂNG HẤP DẪN\nKHÁC ĐANG ĐỢI BẠN KHÁM PHÁ !!',
    illustration: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
    backgroundColor: '#F8F9FA',
  }
];

export default function OnboardingPlayerScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < playerOnboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to player registration or main app
      router.replace('/register');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/register');
  };

  const currentData = playerOnboardingData[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentData.backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentData.backgroundColor} />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>
          {currentIndex === playerOnboardingData.length - 1 ? 'Bắt đầu' : 'Bỏ qua'}
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
          {playerOnboardingData.map((_, index) => (
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
    borderRadius: 20,
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