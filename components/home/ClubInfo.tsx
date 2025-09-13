import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface ClubInfoProps {
  name: string;
  location: string;
  avatarUrl: string;
  onPress?: () => void;
}

export const ClubInfo: React.FC<ClubInfoProps> = ({
  name,
  location,
  avatarUrl,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.clubInfo} onPress={onPress}>
      <Image 
        source={{ uri: avatarUrl }}
        style={styles.clubAvatar}
      />
      <View style={styles.clubOnlineIndicator} />
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
    position: 'absolute',
    bottom: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clubAvatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 0.83,
    borderColor: '#161616',
  },
  clubOnlineIndicator: {
    position: 'absolute',
    left: 34,
    top: 41,
    width: 20,
    height: 20,
    backgroundColor: '#FF004F',
    borderRadius: 10,
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

export default ClubInfo;