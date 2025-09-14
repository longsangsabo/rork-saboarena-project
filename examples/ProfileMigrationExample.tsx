/**
 * Migration Example: Profile Screen
 * Shows before/after using ThemeProvider with design tokens
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

// ❌ BEFORE: Hardcoded styles (current state)
const ProfileScreenOld = () => {
  return (
    <View style={oldStyles.container}>
      <Text style={oldStyles.title}>Profile</Text>
      <Text style={oldStyles.subtitle}>Your Account Settings</Text>
      <View style={oldStyles.card}>
        <Text style={oldStyles.cardTitle}>Personal Info</Text>
        <Text style={oldStyles.cardText}>Update your details</Text>
      </View>
    </View>
  );
};

const oldStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Hardcoded color
    padding: 20, // Random spacing
  },
  title: {
    fontSize: 28, // Random size
    fontWeight: '700', // Random weight
    color: '#00ff88', // Hardcoded color
    marginBottom: 8, // Random spacing
  },
  subtitle: {
    fontSize: 16, // Random size
    color: '#999999', // Hardcoded color
    marginBottom: 24, // Random spacing
  },
  card: {
    backgroundColor: '#2a2a2a', // Hardcoded color
    padding: 16, // Random spacing
    borderRadius: 12, // Random radius
    marginBottom: 16, // Random spacing
  },
  cardTitle: {
    fontSize: 18, // Random size
    fontWeight: '600', // Random weight
    color: '#ffffff', // Hardcoded color
    marginBottom: 4, // Random spacing
  },
  cardText: {
    fontSize: 14, // Random size
    color: '#cccccc', // Hardcoded color
  },
});

// ✅ AFTER: Using design tokens through ThemeProvider
const ProfileScreenNew = () => {
  const theme = useTheme();
  
  return (
    <View style={[
      newStyles.container,
      { backgroundColor: theme.colorStyle('sabo.background.900') }
    ]}>
      <Text style={[
        theme.fontStyle('h2'),
        {
          color: theme.colorStyle('sabo.primary.400'),
          marginBottom: theme.spacingStyle(2), // 8px
        }
      ]}>
        Profile
      </Text>
      
      <Text style={[
        theme.fontStyle('body'),
        {
          color: theme.colorStyle('sabo.text.400'),
          marginBottom: theme.spacingStyle(6), // 24px
        }
      ]}>
        Your Account Settings
      </Text>
      
      <View style={[
        newStyles.card,
        {
          backgroundColor: theme.colorStyle('sabo.background.800'),
          padding: theme.spacingStyle(4), // 16px
          marginBottom: theme.spacingStyle(4), // 16px
        }
      ]}>
        <Text style={[
          theme.fontStyle('h4'),
          {
            color: theme.colorStyle('sabo.text.100'),
            marginBottom: theme.spacingStyle(1), // 4px
          }
        ]}>
          Personal Info
        </Text>
        
        <Text style={[
          theme.fontStyle('bodySmall'),
          { color: theme.colorStyle('sabo.text.300') }
        ]}>
          Update your details
        </Text>
      </View>
    </View>
  );
};

const newStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // This could also use theme.spacingStyle(5)
  },
  card: {
    borderRadius: 12, // This could be added to design tokens
  },
});

// Alternative: Using convenience hooks for cleaner code
const ProfileScreenHooks = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const fontStyles = {
    title: theme.fontStyle('h2'),
    subtitle: theme.fontStyle('body'),
    cardTitle: theme.fontStyle('h4'),
    cardText: theme.fontStyle('bodySmall'),
  };
  
  return (
    <View style={[
      hookStyles.container,
      { backgroundColor: colors.sabo.background[900] }
    ]}>
      <Text style={[
        fontStyles.title,
        hookStyles.title,
        { color: colors.sabo.primary[500] }
      ]}>
        Profile
      </Text>
      {/* Rest of component... */}
    </View>
  );
};

const hookStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
});

export { ProfileScreenOld, ProfileScreenNew, ProfileScreenHooks };