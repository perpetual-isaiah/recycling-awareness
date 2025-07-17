import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import * as Location from 'expo-location';

export default function LocationPermissionScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to allow location to find recycling points.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

     navigation.replace('User', {
  screen: 'MapScreen',
  params: { userLocation: coords },
});

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to get location.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
        <View style={styles.overlay}>
          <Text style={styles.title}>📍 Allow Location Access</Text>
          <Text style={styles.subtitle}>
            To show nearby recycling points, we need your location.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#28a745" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={requestLocation}>
              <Text style={styles.buttonText}>Enable Location 🚀</Text>
            </TouchableOpacity>
          )}
        </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#28a745',    
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
