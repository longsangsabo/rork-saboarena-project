import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface MenuButtonProps {
  onPress?: () => void;
  size?: number;
  style?: any;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ 
  onPress, 
  size = 24, 
  style 
}) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Menu 
        size={size} 
        color={theme.colors.light.text} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
  },
});