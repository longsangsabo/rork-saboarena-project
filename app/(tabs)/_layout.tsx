import { Tabs } from "expo-router";
import { 
  Home, 
  Users, 
  User, 
  Target 
} from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  tournamentIcon: {
    width: 36,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentIconActive: {
    backgroundColor: '#FF004F',
  },
  tournamentIconInactive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#A1A2A5',
  },
  tournamentText: {
    fontSize: 8,
    fontWeight: '400',
  },
  tournamentTextActive: {
    color: 'white',
  },
  tournamentTextInactive: {
    color: 'black',
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF004F',
        tabBarInactiveTintColor: '#8A8B8F',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#D0D1D3',
          borderTopWidth: 0.33,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          letterSpacing: 0.15,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused }) => (
            <Home 
              color={focused ? '#FF004F' : '#8A8B8F'} 
              size={21} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Tìm đối",
          tabBarIcon: ({ focused }) => (
            <Target 
              color={focused ? '#FF004F' : '#8A8B8F'} 
              size={21} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tournaments"
        options={{
          title: "Giải đấu",
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.tournamentIcon,
              focused ? styles.tournamentIconActive : styles.tournamentIconInactive
            ]}>
              <Text style={[
                styles.tournamentText,
                focused ? styles.tournamentTextActive : styles.tournamentTextInactive
              ]}>8</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: "Club",
          tabBarIcon: ({ focused }) => (
            <Users 
              color={focused ? '#060606' : '#8A8B8F'} 
              size={21} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ focused }) => (
            <User 
              color={focused ? '#161722' : '#8A8B8F'} 
              size={21} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
