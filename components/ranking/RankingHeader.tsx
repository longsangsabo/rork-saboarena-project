import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';

interface RankingHeaderProps {
  onBack?: () => void;
  onMore?: () => void;
}

export const RankingHeaderButtons: React.FC<RankingHeaderProps> = ({
  onBack,
  onMore
}) => {
  return (
    <>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
      )}
      {onMore && (
        <TouchableOpacity onPress={onMore} style={styles.headerButton}>
          <MoreHorizontal size={24} color="#333" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
});