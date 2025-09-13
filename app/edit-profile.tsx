import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ChevronLeft, Camera, Copy } from 'lucide-react-native';

interface ProfileData {
  clubName: string;
  username: string;
  link: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  avatarUrl?: string;
  backgroundUrl?: string;
}

export default function EditProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    clubName: 'SABO Billiards',
    username: 'sabobilliards',
    link: 'saboarena.com@lsabobilliards',
    address: '601A Nguyễn An Ninh – TP Vũng Tàu',
    instagram: 'Thêm Instagram vào hồ sơ của bạn',
    facebook: 'Thêm Facebook vào hồ sơ của bạn',
    tiktok: 'Thêm Tiktok vào hồ sơ của bạn'
  });

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
  };

  const handleCopyLink = () => {
    console.log('Copying link:', profileData.link);
  };

  const handleImagePicker = (type: 'avatar' | 'background') => {
    if (!type?.trim()) return;
    console.log('Selecting image for:', type);
  };

  const renderImagePicker = (title: string, type: 'avatar' | 'background') => {
    if (!title?.trim() || !type?.trim()) return null;
    return (
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity 
          style={styles.imagePicker}
          onPress={() => handleImagePicker(type)}
        >
          <View style={styles.imageCircle}>
            <Camera size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.imagePickerLabel}>{title}</Text>
      </View>
    );
  };

  const renderInputField = (
    label: string, 
    value: string, 
    key: keyof ProfileData, 
    hasAction?: boolean,
    actionIcon?: React.ReactNode
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, hasAction && styles.inputWithAction]}
          value={value}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, [key]: text }))}
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
        {hasAction && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCopyLink}
          >
            <View>{actionIcon}</View>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          {renderImagePicker('Đổi ảnh đại diện', 'avatar')}
          {renderImagePicker('Đổi ảnh nền', 'background')}
        </View>

        <View style={styles.formSection}>
          {renderInputField('Tên CLB', profileData.clubName, 'clubName')}
          {renderInputField('Username', profileData.username, 'username')}
          {renderInputField(
            'Link', 
            profileData.link, 
            'link', 
            true, 
            <Copy size={20} color="#666" />
          )}
          {renderInputField('Địa chỉ', profileData.address, 'address')}
          {renderInputField('Instagram', profileData.instagram, 'instagram')}
          {renderInputField('Facebook', profileData.facebook, 'facebook')}
          {renderInputField('Tiktok', profileData.tiktok, 'tiktok')}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
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
  placeholder: {
    width: 40
  },
  content: {
    flex: 1,
    padding: 16
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20
  },
  imagePickerContainer: {
    alignItems: 'center'
  },
  imagePicker: {
    marginBottom: 12
  },
  imageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B7355',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  imagePickerLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  formSection: {
    gap: 20
  },
  inputContainer: {
    marginBottom: 4
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#161722',
    marginBottom: 8
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#161722',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  inputWithAction: {
    paddingRight: 50
  },
  actionButton: {
    position: 'absolute',
    right: 12,
    padding: 8
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});