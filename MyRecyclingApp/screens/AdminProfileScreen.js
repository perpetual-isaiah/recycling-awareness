import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';




export default function AdminProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: 'Admin Name',
    email: 'admin@example.com',
    role: 'Administrator',
    avatar: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    // Fetch user data here
  }, []);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    // Example: Send currentPassword & newPassword to API
    Alert.alert('Success', 'Password changed successfully');
    setModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#4CAF50" />
            )}
          </TouchableOpacity>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.role}>{user.role}</Text>
        </View>

        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.infoRow}>
            <Ionicons name="settings-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow} onPress={() => setModalVisible(true)}>
            <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Change Password</Text>

      {/* Current Password Field */}
      <View style={styles.passwordInputWrapper}>
        <TextInput
          placeholder="Current Password"
          style={styles.passwordInput}
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={() => setShowCurrentPassword((prev) => !prev)}>
          <Ionicons
            name={showCurrentPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* New Password Field */}
      <View style={styles.passwordInputWrapper}>
        <TextInput
          placeholder="New Password"
          style={styles.passwordInput}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword((prev) => !prev)}>
          <Ionicons
            name={showNewPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
          <Text style={{ color: '#666' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={{ color: '#fff' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  container: {
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#111',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  passwordInputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingHorizontal: 14,
  marginBottom: 16,
},
passwordInput: {
  flex: 1,
  height: 50,
  fontSize: 15,
  color: '#111827',
},

});
