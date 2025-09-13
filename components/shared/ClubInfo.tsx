import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ClubInfoProps {
  avatar: string;
  name: string;
  location: string;
  isOnline?: boolean;
  onPress?: () => void;
  style?: any;
}

export const ClubInfo: React.FC<ClubInfoProps> = ({
  avatar,
  name,
  location,
  isOnline = true,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity style={[styles.clubInfo, style]} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.clubAvatar} />
        <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#FF004F' : '#86878B' }]} />
      </View>
      
      <View style={styles.clubDetails}>
        <Text style={styles.clubName}>{name}</Text>
        <View style={styles.clubLocation}>
          <Text style={styles.clubLocationText}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  clubAvatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 0.83,
    borderColor: '#161616',
  },
  onlineIndicator: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  clubDetails: {
    flex: 1,
  },
  clubName: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Aldrich',
    fontWeight: '400',
    marginBottom: 4,
  },
  clubLocation: {
    backgroundColor: '#0A5C6D',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  clubLocationText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
  },
});