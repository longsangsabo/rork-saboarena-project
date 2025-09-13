import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Plus, Search, Filter } from 'lucide-react-native';

interface ChallengeActionsProps {
  onCreateChallenge?: () => void;
  onSearchChallenge?: () => void;
  onFilterChallenge?: () => void;
}

export const ChallengeActions: React.FC<ChallengeActionsProps> = ({
  onCreateChallenge,
  onSearchChallenge,
  onFilterChallenge
}) => {
  const handleCreateChallenge = () => {
    if (onCreateChallenge) {
      onCreateChallenge();
    } else {
      Alert.alert('Tạo thách đấu', 'Tính năng tạo thách đấu sẽ có sớm!');
    }
  };

  const handleSearchChallenge = () => {
    if (onSearchChallenge) {
      onSearchChallenge();
    } else {
      Alert.alert('Tìm kiếm', 'Tính năng tìm kiếm sẽ có sớm!');
    }
  };

  const handleFilterChallenge = () => {
    if (onFilterChallenge) {
      onFilterChallenge();
    } else {
      Alert.alert('Bộ lọc', 'Tính năng bộ lọc sẽ có sớm!');
    }
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.primaryAction} onPress={handleCreateChallenge}>
        <Plus size={20} color="white" />
        <Text style={styles.primaryActionText}>Tạo thách đấu</Text>
      </TouchableOpacity>
      
      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.secondaryAction} onPress={handleSearchChallenge}>
          <Search size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryAction} onPress={handleFilterChallenge}>
          <Filter size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A5C6D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});