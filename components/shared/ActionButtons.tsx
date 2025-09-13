import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, Calendar } from 'lucide-react-native';

interface ActionButtonsProps {
  onPlayNow?: () => void;
  onSchedule?: () => void;
  style?: any;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPlayNow,
  onSchedule,
  style
}) => {
  return (
    <View style={[styles.actionButtons, style]}>
      <TouchableOpacity style={styles.actionButton} onPress={onPlayNow}>
        <View style={styles.actionIcon}>
          <Zap size={18} color="#FF004F" />
        </View>
        <Text style={styles.actionText}>Chơi luôn</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={onSchedule}>
        <View style={styles.actionIcon}>
          <Calendar size={18} color="#FF004F" />
        </View>
        <Text style={styles.actionText}>Lên lịch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});