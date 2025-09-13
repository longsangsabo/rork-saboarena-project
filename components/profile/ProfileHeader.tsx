import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';

interface ProfileHeaderProps {
  name: string;
  location: string;
  avatarUrl: string;
  onCameraPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  location,
  avatarUrl,
  onCameraPress
}) => {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraButton} onPress={onCameraPress}>
          <Camera size={16} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationContainer: {
    backgroundColor: '#0A5C6D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProfileHeader;