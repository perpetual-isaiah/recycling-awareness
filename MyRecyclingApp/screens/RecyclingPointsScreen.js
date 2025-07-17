import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';  // Expo Location for current position
import { API_BASE_URL } from '../config';

const { height } = Dimensions.get('window');

const RecyclingPointsScreen = () => {
  const [activeTab, setActiveTab] = useState('Map');
  const [searchText, setSearchText] = useState('');
  const [recyclingPoints, setRecyclingPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location permission to use this feature');
        setLoading(false);
        return;
      }

      // Get current position
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Fetch recycling points from API
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recycling-points`);
        setRecyclingPoints(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load recycling points');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPoints = recyclingPoints.filter(point =>
    point.name.toLowerCase().includes(searchText.toLowerCase()) ||
    point.address.toLowerCase().includes(searchText.toLowerCase()) ||
    point.region.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Please enable location services</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Input */}
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, address, or region"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Map' && styles.activeTab]}
            onPress={() => setActiveTab('Map')}
          >
            <Text style={[styles.tabText, activeTab === 'Map' && styles.activeTabText]}>
              Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'List' && styles.activeTab]}
            onPress={() => setActiveTab('List')}
          >
            <Text style={[styles.tabText, activeTab === 'List' && styles.activeTabText]}>
              List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'Map' ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {filteredPoints.map(point => (
                <Marker
                  key={point._id}
                  coordinate={{ latitude: point.lat, longitude: point.lng }}
                  title={point.name}
                  description={point.materials.join(', ')}
                >
                  <View style={styles.markerContainer}>
                    <Ionicons name="leaf" size={24} color="#16a34a" />
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredPoints.map(point => (
              <View key={point._id} style={styles.pointCard}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.address}>{point.address}</Text>
                <Text style={styles.region}>{point.region}</Text>
                <Text style={styles.materials}>Accepts: {point.materials.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    margin: 10,
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#374151',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    height: height * 0.6,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  listContainer: {
    flexGrow: 1,
    marginHorizontal: 10,
  },
  pointCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pointName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  region: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  materials: {
    fontSize: 14,
    color: '#4caf50',
  },
});

export default RecyclingPointsScreen;
