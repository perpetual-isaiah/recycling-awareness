import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminSettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Settings</Text>

      <TouchableOpacity
  style={styles.option}
  onPress={() => {
  const parentNav = navigation.getParent();
  if (parentNav) {
    parentNav.navigate('AdminProfile');
  } else {
    console.warn('Parent navigator not found!');
  }
}}

>
  <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
  <Text style={styles.optionText}>Profile</Text>
</TouchableOpacity>


      <TouchableOpacity style={styles.option}>
        <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
        <Text style={styles.optionText}>Privacy & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#555',
  },
  logoutButton: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
