import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';

interface ChallengeHeaderProps {
  onBack?: () => void;
  onMore?: () => void;
}

export default function ChallengeHeader({ onBack, onMore }: ChallengeHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Thách đấu</Text>
      
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <MoreHorizontal size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  moreButton: {
    padding: 8,
  },
});