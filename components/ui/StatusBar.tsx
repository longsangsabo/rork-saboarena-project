import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StatusBarProps {
  time?: string;
  showBattery?: boolean;
  isDark?: boolean;
}

export const CustomStatusBar: React.FC<StatusBarProps> = ({ 
  time = '9:41', 
  showBattery = true,
  isDark = false 
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.statusBar, { paddingTop: insets.top }]}>
      <Text style={[styles.timeText, isDark && styles.darkText]}>{time}</Text>
      {showBattery && <View style={[styles.batteryIcon, isDark && styles.darkBattery]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'SF Pro Text',
    fontWeight: '600',
  },
  darkText: {
    color: 'black',
  },
  batteryIcon: {
    width: 18,
    height: 6.5,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  darkBattery: {
    backgroundColor: 'black',
  },
});