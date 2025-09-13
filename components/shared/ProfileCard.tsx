import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit3, Camera } from 'lucide-react-native';

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  showEditButton?: boolean;
  onEditPress?: () => void;
  size?: 'large' | 'medium';
  style?: any;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUrl,
  name,
  showEditButton = false,
  onEditPress,
  size = 'large',
  style
}) => {
  const isLarge = size === 'large';
  const containerSize = isLarge ? 350 : 299;
  const imageSize = isLarge ? 346 : 295;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={['rgba(119, 132, 248, 0.40)', 'rgba(27, 26, 38, 0.20)', 'rgba(198, 149, 248, 0.40)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBorder, { width: containerSize, height: containerSize }]}
        >
          <View style={[styles.imageWrapper, { width: imageSize, height: imageSize }]}>
            <ImageBackground
              source={{ uri: imageUrl }}
              style={styles.profileImage}
              imageStyle={styles.profileImageStyle}
            >
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.overlay}
              >
                <Text style={[styles.profileName, isLarge && styles.largeProfileName]}>
                  {name}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </View>
        </LinearGradient>
        
        {showEditButton && (
          <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
            {size === 'large' ? (
              <Edit3 size={14} color="black" />
            ) : (
              <Camera size={20} color="black" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  gradientBorder: {
    borderRadius: 18,
    padding: 2,
    shadowColor: 'rgba(255, 255, 255, 0.10)',
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  profileImageStyle: {
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#A0B2F8',
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 36,
  },
  largeProfileName: {
    fontSize: 40,
  },
  editButton: {
    position: 'absolute',
    right: 27,
    bottom: -10,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});