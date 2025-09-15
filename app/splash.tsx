import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const onboardingData = [
  {
    id: 1,
    title: 'BẠN LÀ AI ???',
    subtitle: 'Người chơi',
    subtitle2: 'Chủ CLB',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center',
    playerImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=200&h=200&fit=crop&crop=center',
    clubImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center'
  },
  {
    id: 2,
    title: 'TÌM BẠN CHƠI BIDA !!',
    description: 'Bạn muốn chơi bida, nhưng đối của bạn bận cả rồi !!! Hmm..\nĐể SABO tìm đối cần kèo cho bạn nha!!!',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 3,
    title: 'ĐÁNH GIẢI ĐỂ NÂNG TRÌNH !!',
    description: 'Tham gia các giải đấu phong trào hàng tuần bạn sẽ có cơ hội cọ sát với các cơ thủ cùng trình độ !!\nVà nhận về vô vàn phần quà hấp dẫn !!',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 4,
    title: 'CHẾ ĐỘ THÁCH ĐẤU !!',
    description: 'Chế độ thách đấu giúp bạn giao lưu với các cơ thủ kinh nghiệm, qua đó bạn sẽ có cơ hội học hỏi và cải thiện kỹ năng của mình !!',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 5,
    title: 'XẾT HẠNG MINH BẠCH !!',
    description: 'Nói không với bịp hàng , SABO giúp bạn bắt kèo với các cơ thủ cùng trình độ để tăng trải nghiệm chơi bida của bạn !!\n\nCác cơ thủ khi đã được xác minh hạng sẽ được tham gia mọi giải đấu tại các CLB có sử dụng nền tảng.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 6,
    title: 'LƯU TRỮ THÀNH TÍCH VÀ\nLỊCH SỬ THI ĐẤU !!',
    description: 'SABO giúp lưu trữ lịch sử thi đấu và thành tích chơi bida của bạn, giúp bạn thống kê và theo dõi quá trình tiến bộ của mình !!',
    boldText: 'VÀ RẤT NHIỀU TÍNH NĂNG HẤP DẪN\nKHÁC ĐANG ĐỢI BẠN KHÁM PHÁ !!',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center'
  }
];

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowAuth(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    setShowAuth(true);
  };

  const handleGetStarted = () => {
    router.replace('/(tabs)/home');
  };

  if (showAuth) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.authContainer}>
          <Text style={styles.authTitle}>Chào mừng đến với SABO Arena!</Text>
          <Text style={styles.authSubtitle}>Bắt đầu hành trình billiards của bạn</Text>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentData = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{currentIndex === onboardingData.length - 1 ? 'Bắt đầu' : 'Bỏ qua'}</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {currentIndex === 0 ? (
          // First screen with special layout
          <View style={styles.firstScreenContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoText}>S</Text>
              </View>
            </View>
            
            <Text style={styles.title}>{currentData.title}</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => router.push('/onboarding-player')}
                activeOpacity={0.7}
              >
                <Image source={{ uri: currentData.playerImage }} style={styles.optionImage} />
                <Text style={styles.optionText}>{currentData.subtitle}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={() => router.push('/onboarding-club')}
                activeOpacity={0.7}
              >
                <Image source={{ uri: currentData.clubImage }} style={styles.optionImage} />
                <Text style={styles.optionText}>{currentData.subtitle2}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Other screens
          <View style={styles.screenContent}>
            {currentIndex === 2 || currentIndex === 4 ? (
              <View style={styles.illustrationContainer}>
                <Image source={{ uri: currentData.image }} style={styles.illustration} />
              </View>
            ) : null}
            
            <Text style={styles.title}>{currentData.title}</Text>
            <Text style={styles.description}>{currentData.description}</Text>
            
            {currentData.boldText && (
              <Text style={styles.boldDescription}>{currentData.boldText}</Text>
            )}
          </View>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]} 
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View 
              key={`dot-${index}`} 
              style={[styles.dot, index === currentIndex && styles.activeDot]} 
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  },
  skipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  firstScreenContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6503C8',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
  },
  optionCard: {
    alignItems: 'center',
    padding: 20,
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  screenContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    marginBottom: 40,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
  boldDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    color: '#1a1a1a',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A5D23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
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
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4A5D23',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 60,
  },
  getStartedButton: {
    backgroundColor: '#4A5D23',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
  },
  getStartedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});