import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit3 } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface UserAvatarProps {
  imageUrl?: string;
  size?: number;
  showEditButton?: boolean;
  onEditPress?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  size = 120,
  showEditButton = true,
  onEditPress
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={
          imageUrl 
            ? { uri: imageUrl }
            : require('@/assets/images/adaptive-icon.png') // Default avatar
        }
        style={[
          styles.avatar, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderColor: theme.colors.sabo.border.default
          }
        ]}
        resizeMode="cover"
      />
      
      {showEditButton && (
        <TouchableOpacity
          style={[
            styles.editButton,
            { 
              backgroundColor: theme.colors.light.background,
              borderColor: theme.colors.sabo.border.default,
              bottom: size * 0.05,
              right: size * 0.05
            }
          ]}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Edit3 
            size={size * 0.15} 
            color={theme.colors.light.text} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  avatar: {
    borderWidth: 3,
  },
  editButton: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});