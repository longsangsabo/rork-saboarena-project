import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';

interface RankingHeaderProps {
  onBack: () => void;
  onMore?: () => void;
}

export const RankingHeader: React.FC<RankingHeaderProps> = ({ onBack, onMore }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Bảng xếp hạng</Text>
      
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <MoreHorizontal size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
  },
});