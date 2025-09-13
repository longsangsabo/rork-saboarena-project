import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBarProps {
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = '9:41' }) => {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.timeText}>{time}</Text>
      <View style={styles.statusIcons} />
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
  statusIcons: {
    width: 18,
    height: 6.5,
    backgroundColor: 'white',
    borderRadius: 1,
  },
});

export default StatusBar;