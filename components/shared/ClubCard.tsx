import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface ClubCardProps {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  imageUrl: string;
  onPress?: () => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  name,
  location,
  memberCount,
  imageUrl,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.clubCard} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.clubCardImage} />
      <View style={styles.clubCardContent}>
        <View style={styles.clubLocation}>
          <MapPin size={12} color="#BA1900" />
          <Text style={styles.clubLocationText}>{location}</Text>
        </View>
        <Text style={styles.clubName}>{name}</Text>
        <Text style={styles.clubMembers}>{memberCount} thành viên</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubCardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  clubCardContent: {
    padding: 12,
  },
  clubLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  clubLocationText: {
    fontSize: 12,
    color: '#BA1900',
    fontWeight: '500',
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clubMembers: {
    fontSize: 12,
    color: '#666',
  },
});