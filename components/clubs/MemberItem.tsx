import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}

interface MemberItemProps {
  member: Member;
  onPress?: (member: Member) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({ member, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.memberItem} 
      onPress={() => onPress?.(member)}
    >
      <View style={styles.memberInfo}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
          <View 
            style={[
              styles.onlineIndicator, 
              { backgroundColor: member.isOnline ? '#5AD439' : '#86878B' }
            ]} 
          />
        </View>
        
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRank}>Rank {member.rank}</Text>
        </View>
      </View>
      
      <Text style={styles.joinDate}>{member.joinDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  memberAvatar: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    borderWidth: 1,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    color: 'black',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 2,
  },
  memberRank: {
    color: 'rgba(0, 0, 0, 0.50)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  joinDate: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'right',
  },
});