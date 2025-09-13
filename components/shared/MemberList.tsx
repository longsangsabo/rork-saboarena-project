import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}

interface MemberListProps {
  members: Member[];
  loading?: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({ members, loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải thành viên...</Text>
      </View>
    );
  }

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
        <View style={[
          styles.onlineIndicator, 
          { backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E' }
        ]} />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRank}>Rank: {item.rank}</Text>
        <Text style={styles.memberJoinDate}>Tham gia: {item.joinDate}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={members}
      renderItem={renderMember}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.membersList}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  membersList: {
    paddingVertical: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  memberRank: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  memberJoinDate: {
    fontSize: 12,
    color: '#999',
  },
});