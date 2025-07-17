import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [challengeCount, setChallengeCount] = useState(0);

  const guideMaterials = [
    { key: 'plastic', label: 'Plastic', icon: <MaterialCommunityIcons name="bottle-soda" size={26} color="#4CAF50" /> },
    { key: 'glass', label: 'Glass', icon: <MaterialCommunityIcons name="glass-fragile" size={26} color="#4CAF50" /> },
    { key: 'paper', label: 'Paper', icon: <Ionicons name="document-text-outline" size={26} color="#4CAF50" /> },
    { key: 'metal', label: 'Metal', icon: <FontAwesome5 name="industry" size={26} color="#4CAF50" /> },
    { key: 'carton', label: 'Carton', icon: <MaterialCommunityIcons name="package-variant" size={26} color="#4CAF50" /> },
    { key: 'ewaste', label: 'E-Waste', icon: <MaterialCommunityIcons name="desktop-classic" size={26} color="#4CAF50" /> },
    { key: 'organic', label: 'Organic', icon: <MaterialCommunityIcons name="leaf" size={26} color="#4CAF50" /> },
    { key: 'batteries', label: 'Batteries', icon: <MaterialCommunityIcons name="battery-alert" size={26} color="#4CAF50" /> },
    { key: 'clothes', label: 'Clothes', icon: <MaterialCommunityIcons name="tshirt-crew" size={26} color="#4CAF50" /> },
    { key: 'tires', label: 'Tires', icon: <MaterialCommunityIcons name="car-tire-alert" size={26} color="#4CAF50" /> },
    { key: 'construction', label: 'Construction', icon: <MaterialCommunityIcons name="hammer-screwdriver" size={26} color="#4CAF50" /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, challengeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/user/profile`, { headers }),
          axios.get(`${API_BASE_URL}/api/user/challenges`, { headers }),
        ]);

        const { user } = profileRes.data;
        setUser({
          name: user.name || '',
          location: user.city || 'Unknown',
        });

        setChallengeCount(challengeRes.data.challenges.length || 0);
      } catch (error) {
        console.error('❌ Failed to fetch user or challenges:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2FAF2' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo2s.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>
              Re <Text style={{ color: '#264E29' }}>Think</Text>
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')} style={{ marginRight: 16 }}>
              <Ionicons name="notifications-outline" size={22} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle-outline" size={24} color="#6BB200" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>Hi, {user.name || '...'}</Text>
        <Text style={styles.subtext}>Let's contribute to our earth.</Text>

        <View style={styles.locationBox}>
          <Ionicons name="location-sharp" size={22} color="#4CAF50" />
          <Text style={styles.locationText}>{user.location}</Text>
        </View>

        <Text style={styles.sectionTitle}>Recycling Guide</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {guideMaterials.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.iconCard}
              onPress={() => navigation.navigate('Guide', { material: item.key })}
            >
              {item.icon}
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹0.00</Text>
            <Text style={styles.statLabel}>Earned So far</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Pickups</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>~0 Ltrs</Text>
            <Text style={styles.statLabel}>Fuel Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>~0 Kgs</Text>
            <Text style={styles.statLabel}>CO₂ Averted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>~0</Text>
            <Text style={styles.statLabel}>Trees Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>~0 Kgs</Text>
            <Text style={styles.statLabel}>Waste</Text>
          </View>

          {/* Dynamic Challenge Count */}
          <TouchableOpacity
            style={[styles.statCard, styles.challengeCard]}
            onPress={() => navigation.navigate('MyChallenges')}
          >
            <Ionicons name="trophy-outline" size={28} color="#fff" style={styles.statIcon} />
            <Text style={[styles.statValue, { color: '#fff' }]}>{challengeCount}</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Challenges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, styles.impactCard]}
            onPress={() => navigation.navigate('ImpactScreen')}
          >
            <Ionicons name="analytics-outline" size={28} color="#fff" style={styles.statIcon} />
            <Text style={[styles.statValue, { color: '#fff' }]}>View</Text>
            <Text style={[styles.statLabel, { color: '#fff' }]}>Impact Summary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5FFED' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 38, height: 38, marginRight: 8 },
  logoText: { fontSize: 24, color: '#6BB200', fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  subtext: { fontSize: 14, color: '#666' },
  locationBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 15,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  locationText: { marginLeft: 6, fontSize: 16 },
  sectionTitle: { marginTop: 20, fontSize: 16, fontWeight: 'bold', color: '#333' },
  carousel: { marginTop: 12, marginBottom: 20 },
  iconCard: {
    backgroundColor: '#DFFFD8',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  iconLabel: { fontSize: 12, marginTop: 6, textAlign: 'center', color: '#333' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statValue: { fontWeight: 'bold', fontSize: 18 },
  statLabel: { fontSize: 12, color: '#555', marginTop: 4 },
  statIcon: { fontSize: 28, marginBottom: 8, alignSelf: 'center' },
  challengeCard: { backgroundColor: '#3B82F6' },
  impactCard: { backgroundColor: '#22C55E' },
});
