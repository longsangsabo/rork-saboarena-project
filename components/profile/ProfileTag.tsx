import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface ProfileTagProps {
  username: string;
  style?: any;
}

export const ProfileTag: React.FC<ProfileTagProps> = ({ username, style }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[
        styles.username,
        { color: theme.colors.light.text }
      ]}>
        @{username}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
  },
});