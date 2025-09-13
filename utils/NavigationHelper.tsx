import React from 'react';
import { TouchableOpacity, Alert, Platform } from 'react-native';
import { router } from 'expo-router';

interface NavigationHelperProps {
  children?: React.ReactNode;
}

export class NavigationHelper {
  static goToProfile(userId?: string) {
    if (Platform.OS === 'web') {
      console.log('Navigate to profile:', userId);
    } else {
      router.push('/profile');
    }
  }

  static goToClub(clubId?: string) {
    if (Platform.OS === 'web') {
      console.log('Navigate to club:', clubId);
    } else {
      router.push('/clubs');
    }
  }

  static goToTournament(tournamentId?: string) {
    if (Platform.OS === 'web') {
      console.log('Navigate to tournament:', tournamentId);
    } else {
      router.push('/tournaments');
    }
  }

  static goToChallenges() {
    if (Platform.OS === 'web') {
      console.log('Navigate to challenges');
    } else {
      router.push('/challenges');
    }
  }

  static goToHome() {
    if (Platform.OS === 'web') {
      console.log('Navigate to home');
    } else {
      router.push('/home');
    }
  }

  static showFeatureComingSoon(featureName: string) {
    if (Platform.OS === 'web') {
      console.log(`${featureName} feature coming soon!`);
    } else {
      Alert.alert('Sắp có', `Tính năng ${featureName} sẽ có sớm!`);
    }
  }

  static showConfirmDialog(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    if (Platform.OS === 'web') {
      if (confirm(`${title}\n${message}`)) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    } else {
      Alert.alert(
        title,
        message,
        [
          { text: 'Hủy', style: 'cancel', onPress: onCancel },
          { text: 'Xác nhận', onPress: onConfirm }
        ]
      );
    }
  }

  static showSuccessMessage(message: string) {
    if (Platform.OS === 'web') {
      console.log('Success:', message);
    } else {
      Alert.alert('Thành công', message);
    }
  }

  static showErrorMessage(message: string) {
    if (Platform.OS === 'web') {
      console.error('Error:', message);
    } else {
      Alert.alert('Lỗi', message);
    }
  }
}

export function NavigationProvider({ children }: NavigationHelperProps) {
  return <>{children}</>;
}