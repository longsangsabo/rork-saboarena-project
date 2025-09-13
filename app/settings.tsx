import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { 
  ChevronLeft, 
  User, 
  UserPlus, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight 
} from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  showArrow?: boolean;
  isDestructive?: boolean;
}

export default function SettingsScreen() {
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleFindFriends = () => {
    router.push('/find-friends');
  };

  const handleNotifications = () => {
    console.log('Notifications settings');
  };

  const handlePrivacy = () => {
    console.log('Privacy settings');
  };

  const handleHelp = () => {
    console.log('Help & Support');
  };

  const handleAbout = () => {
    console.log('About app');
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  const settingsSections = [
    {
      title: 'Tài khoản',
      items: [
        {
          id: 'edit-profile',
          title: 'Chỉnh sửa hồ sơ',
          icon: <User size={24} color="#666" />,
          onPress: handleEditProfile,
          showArrow: true
        },
        {
          id: 'find-friends',
          title: 'Tìm bạn bè',
          icon: <UserPlus size={24} color="#666" />,
          onPress: handleFindFriends,
          showArrow: true
        }
      ]
    },
    {
      title: 'Cài đặt',
      items: [
        {
          id: 'notifications',
          title: 'Thông báo',
          icon: <Bell size={24} color="#666" />,
          onPress: handleNotifications,
          showArrow: true
        },
        {
          id: 'privacy',
          title: 'Quyền riêng tư',
          icon: <Shield size={24} color="#666" />,
          onPress: handlePrivacy,
          showArrow: true
        }
      ]
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          id: 'help',
          title: 'Trợ giúp & Hỗ trợ',
          icon: <HelpCircle size={24} color="#666" />,
          onPress: handleHelp,
          showArrow: true
        },
        {
          id: 'about',
          title: 'Về ứng dụng',
          icon: <Info size={24} color="#666" />,
          onPress: handleAbout,
          showArrow: true
        }
      ]
    },
    {
      title: '',
      items: [
        {
          id: 'logout',
          title: 'Đăng xuất',
          icon: <LogOut size={24} color="#FF3B30" />,
          onPress: handleLogout,
          showArrow: false,
          isDestructive: true
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.settingItem,
        item.isDestructive && styles.destructiveItem
      ]}
      onPress={item.onPress}
    >
      <View style={styles.settingItemLeft}>
        {item.icon}
        <Text style={[
          styles.settingItemText,
          item.isDestructive && styles.destructiveText
        ]}>
          {item.title}
        </Text>
      </View>
      {item.showArrow && (
        <ChevronRight size={20} color="#C7C7CC" />
      )}
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
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
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
  placeholder: {
    width: 40
  },
  content: {
    flex: 1
  },
  section: {
    marginTop: 32
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6D6D72',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 16
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44
  },
  destructiveItem: {
    backgroundColor: 'white'
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  settingItemText: {
    fontSize: 17,
    color: '#000',
    marginLeft: 12,
    fontWeight: '400'
  },
  destructiveText: {
    color: '#FF3B30'
  },
  separator: {
    height: 0.5,
    backgroundColor: '#C6C6C8',
    marginLeft: 52
  }
});