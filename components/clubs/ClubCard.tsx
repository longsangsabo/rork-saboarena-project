import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Users, Trophy } from 'lucide-react-native';

interface ClubCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  memberCount: number;
  tournamentCount: number;
  onPress?: (clubId: string) => void;
  onJoin?: (clubId: string) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  id,
  name,
  location,
  imageUrl,
  memberCount,
  tournamentCount,
  onPress,
  onJoin
}) => {
  return (
    <View style={styles.clubCard}>
      <Image source={{ uri: imageUrl }} style={styles.clubCardImage} />
      <View style={styles.clubCardContent}>
        <Text style={styles.clubCardName}>{name}</Text>
        <View style={styles.clubCardLocation}>
          <MapPin size={12} color="#BA1900" />
          <Text style={styles.clubCardLocationText}>{location}</Text>
        </View>
        
        <View style={styles.clubCardStats}>
          <View style={styles.statItem}>
            <Users size={14} color="#666" />
            <Text style={styles.statText}>{memberCount} thành viên</Text>
          </View>
          <View style={styles.statItem}>
            <Trophy size={14} color="#666" />
            <Text style={styles.statText}>{tournamentCount} giải đấu</Text>
          </View>
        </View>
        
        <View style={styles.clubCardActions}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => onPress?.(id)}
          >
            <Text style={styles.viewButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => onJoin?.(id)}
          >
            <Text style={styles.joinButtonText}>Tham gia</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubCardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clubCardContent: {
    padding: 16,
  },
  clubCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  clubCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  clubCardLocationText: {
    fontSize: 14,
    color: '#BA1900',
  },
  clubCardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  clubCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#0A5C6D',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default ClubCard;