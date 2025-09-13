import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Search, UserPlus, Phone, Maximize2 } from 'lucide-react-native';

interface FindFriendOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

export default function FindFriendsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    if (!query?.trim()) return;
    console.log('Searching for:', query);
  };

  const handleFindByPhone = () => {
    console.log('Finding friends by phone');
  };

  const handleFindByFacebook = () => {
    console.log('Finding friends via Facebook');
  };

  const handleFindByInstagram = () => {
    console.log('Finding friends via Instagram');
  };

  const handleFindByTiktok = () => {
    console.log('Finding friends via TikTok');
  };

  const handleAddFriend = () => {
    console.log('Adding new friend');
  };

  const findOptions: FindFriendOption[] = [
    {
      id: 'add',
      title: 'Tìm bạn',
      icon: <UserPlus size={24} color="white" />,
      color: '#FF6B6B',
      onPress: handleAddFriend
    },
    {
      id: 'phone',
      title: 'Tìm bạn qua sdt',
      icon: <Phone size={24} color="white" />,
      color: '#4ECDC4',
      onPress: handleFindByPhone
    },
    {
      id: 'facebook',
      title: 'Tìm bạn qua facebook',
      icon: <View style={styles.facebookIcon}><Text style={styles.facebookText}>f</Text></View>,
      color: '#4267B2',
      onPress: handleFindByFacebook
    },
    {
      id: 'instagram',
      title: 'Tìm bạn qua instagram',
      icon: <View style={styles.instagramIcon}><Text style={styles.instagramText}>📷</Text></View>,
      color: '#E4405F',
      onPress: handleFindByInstagram
    },
    {
      id: 'tiktok',
      title: 'Tìm bạn qua tiktok',
      icon: <View style={styles.tiktokIcon}><Text style={styles.tiktokText}>♪</Text></View>,
      color: '#000000',
      onPress: handleFindByTiktok
    }
  ];

  const renderFindOption = (option: FindFriendOption) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionContainer}
      onPress={option.onPress}
    >
      <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
        {option.icon}
      </View>
      <Text style={styles.optionTitle}>{option.title}</Text>
      <View style={styles.optionArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#161722" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm bạn</Text>
        <TouchableOpacity style={styles.expandButton}>
          <Maximize2 size={20} color="#161722" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
          </View>
        </View>

        <View style={styles.optionsSection}>
          {findOptions.map(renderFindOption)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#161722'
  },
  expandButton: {
    padding: 8
  },
  content: {
    flex: 1
  },
  searchSection: {
    padding: 16,
    backgroundColor: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  searchIcon: {
    marginRight: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#161722'
  },
  optionsSection: {
    padding: 16,
    gap: 16
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#161722'
  },
  optionArrow: {
    padding: 4
  },
  arrowText: {
    fontSize: 20,
    color: '#999',
    fontWeight: '300'
  },
  facebookIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  facebookText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4267B2'
  },
  instagramIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  instagramText: {
    fontSize: 14
  },
  tiktokIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tiktokText: {
    fontSize: 14,
    color: '#000'
  }
});