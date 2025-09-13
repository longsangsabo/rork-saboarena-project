import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Member {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  isOnline: boolean;
}

interface MemberListProps {
  members: Member[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const renderMember = (member: Member) => (
    <View key={member.id} style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
        {member.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRank}>Rank {member.rank}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.membersList}>
      {members.map(renderMember)}
    </View>
  );
};

const styles = StyleSheet.create({
  membersList: {
    paddingHorizontal: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  memberRank: {
    fontSize: 12,
    color: '#666',
  },
});

export default MemberList;