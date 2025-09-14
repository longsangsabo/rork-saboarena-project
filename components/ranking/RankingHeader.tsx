import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';

interface RankingHeaderButtonsProps {
  onBack?: () => void;
  onMore?: () => void;
}

export function RankingHeaderButtons({ onBack, onMore }: RankingHeaderButtonsProps) {
  if (onBack) {
    return (
      <TouchableOpacity style={styles.headerButton} onPress={onBack}>
        <ArrowLeft size={24} color="#161722" />
      </TouchableOpacity>
    );
  }

  if (onMore) {
    return (
      <TouchableOpacity style={styles.headerButton} onPress={onMore}>
        <MoreHorizontal size={24} color="#161722" />
      </TouchableOpacity>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
});