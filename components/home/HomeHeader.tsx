import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Sun, MessageSquare } from 'lucide-react-native';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onSunPress?: () => void;
  onMessagePress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onNotificationPress,
  onSunPress,
  onMessagePress
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.saboTitle}>SABO</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon} onPress={onSunPress}>
          <Sun size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={onMessagePress}>
          <MessageSquare size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={onNotificationPress}>
          <Bell size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  saboTitle: {
    color: '#6503C8',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
});

export default HomeHeader;