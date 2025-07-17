import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import RecyclingPointsScreen from '../screens/RecyclingPointsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';  // import scanner

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const iconSize = 26;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icons = {
          Home: 'home-outline',
          Guides: 'leaf-outline',
          RecyclingPoints: 'location-outline',
          Settings: 'settings-outline',
        };

        // For BarcodeScanner tab, no default icon because we want a custom button
        if (route.name === 'Scanner') {
          return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: '#4CAF50',
              height: 70,
              borderTopWidth: 0,
              elevation: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: 8,
            },
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={styles.scanButton}>
                <Ionicons name="scan" size={32} color="#fff" />
              </TouchableOpacity>
            ),
          };
        }

        return {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#4CAF50',
            height: 70,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: focused ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
              >
                <Ionicons
                  name={icons[route.name]}
                  size={iconSize}
                  color="#fff"
                />
              </View>
            </View>
          ),
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Guides" component={GuideScreen} />
      <Tab.Screen name="Scanner" component={BarcodeScannerScreen} />
      <Tab.Screen name="RecyclingPoints" component={RecyclingPointsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    top: -25, // float above the tab bar
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
});
