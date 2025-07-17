import ModalSelector from 'react-native-modal-selector';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function EditProfileScreen({ navigation, route }) {
  const { currentUser } = route.params;

  const [phone, setPhone] = useState(currentUser.phone || '');
  const [gender, setGender] = useState(currentUser.gender || '--');
  const [dob, setDob] = useState(currentUser.dob || '');
  const [avatar, setAvatar] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadAvatar = async () => {
      const savedAvatar = await AsyncStorage.getItem('userAvatar');
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    };
    loadAvatar();
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      await AsyncStorage.setItem('userAvatar', uri);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/user/profile`,
        {
          phone,
          gender,
          dateOfBirth: dob,
          profilePhotoUrl: avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('Profile', {
        updatedInfo: {
          phone,
          gender,
          age: new Date().getFullYear() - new Date(dob).getFullYear(),
          avatar,
        },
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const genderOptions = [
    { key: '--', label: '--' },
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4FBF5' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        {/* Avatar Section */}
        <TouchableOpacity onPress={handlePickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Image
              source={require('../assets/avatar-placeholder.png')}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginBottom: 16, color: '#888' }}>
          Tap photo to change
        </Text>

        {/* Full Name */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={currentUser.name}
            editable={false}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={currentUser.email}
            editable={false}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
            placeholder="Enter phone number"
          />
        </View>

        {/* Gender with ModalSelector */}
       {/* Gender with ModalSelector */}
<View style={styles.inputWrapper}>
  <Text style={styles.label}>Gender</Text>
  <ModalSelector
    data={genderOptions}
    initValue="Select gender"
    supportedOrientations={['portrait']}
    accessible={true}
    scrollViewAccessibilityLabel={'Scrollable options'}
    cancelText="Cancel"
    onChange={(option) => setGender(option.key)}
    selectStyle={styles.pickerWrapper}
    selectTextStyle={[
      styles.pickerText,
      gender === '--' ? styles.placeholderText : null,
    ]}
    optionTextStyle={{ fontSize: 16, color: '#111827' }}
    optionContainerStyle={{ backgroundColor: '#fff' }}
  >
    <View style={styles.selectorInner}>
      <Text
        style={[
          styles.pickerText,
          gender === '--' ? styles.placeholderText : null,
        ]}
      >
        {genderOptions.find((opt) => opt.key === gender)?.label || 'Select gender'}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#999" />
    </View>
  </ModalSelector>
</View>


        {/* Date of Birth */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{dob ? new Date(dob).toDateString() : 'Select date'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDob(selectedDate.toISOString());
              }}
            />
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20,  backgroundColor: '#F9FBF9'},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#111827',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  pickerText: {
    fontSize: 15,
    color: '#111827',
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  selectorInner: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: 12,
},
placeholderText: {
  color: '#999',
  fontStyle: 'italic',
},

});
