import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation, route }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    gender: '--',
    age: '--',
    profilePhotoUrl: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data from API + load local avatar
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = response.data.user;

      const savedAvatar = await AsyncStorage.getItem('userAvatar');

      setUser({
        name: u.name || '',
        email: u.email || '',
        gender: u.gender || '--',
        age:
          u.dateOfBirth
            ? new Date().getFullYear() - new Date(u.dateOfBirth).getFullYear()
            : '--',
        profilePhotoUrl: savedAvatar || u.profilePhotoUrl || null,
      });
    } catch (err) {
      console.error('❌ Failed to fetch user:', err.message);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Refresh on screen focus and update from route params
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedAvatar = await AsyncStorage.getItem('userAvatar');

        setUser((prev) => ({
          ...prev,
          profilePhotoUrl: savedAvatar || prev.profilePhotoUrl,
          ...route.params?.updatedInfo,
        }));
      };

      loadData();
    }, [route.params])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  }, []);

  const detailItems = [
    { label: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { label: 'Password', icon: 'lock-closed-outline', screen: 'Password' },
    { label: 'Contact Info', icon: 'call-outline', screen: 'ContactInfo' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.headerTitle}>Account</Text>

        {/* Profile Card */}
        <View style={styles.profileBox}>
          <Image
            source={
              user.profilePhotoUrl
                ? { uri: user.profilePhotoUrl }
                : require('../assets/avatar-placeholder.png')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.nameText}>{user.name}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.subText}>
              {user.gender}, {user.age} yrs
            </Text>
          </View>
        </View>

        {/* Account Detail List */}
        <Text style={styles.sectionTitle}>Account Details</Text>

        {detailItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.detailItem}
            onPress={() =>
              navigation.navigate(item.screen, { currentUser: user })
            }
          >
            <View style={styles.detailLeft}>
              <Ionicons name={item.icon} size={20} color="#4CAF50" />
              <Text style={styles.detailLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FBF9' },
  container: { padding: 20,  backgroundColor: '#F9FBF9' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFE0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#E0E0E0',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emailText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '400',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
});
