import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext'; // <-- your context hook

export default function SettingsScreen() {
  const navigation = useNavigation();

  const { darkMode, toggleTheme } = useTheme();  // Use global darkMode here

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load saved notifications setting from storage
    const loadSettings = async () => {
      const storedNotifications = await AsyncStorage.getItem('notifications_enabled');
      if (storedNotifications !== null) setNotificationsEnabled(JSON.parse(storedNotifications));
    };
    loadSettings();
  }, []);

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notifications_enabled', JSON.stringify(newValue));
  };

  const handleClearData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('✅ Success', 'All local data cleared.');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear data.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@recyclingapp.com?subject=Support Request');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://yourapp.com/privacy-policy');
  };

  const SettingItem = ({ label, isSwitch, value, onValueChange, onPress, icon, danger }) => (
    <TouchableOpacity
      style={[styles.item, darkMode && styles.itemDark]}
      onPress={onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
    >
      <View style={styles.labelWrap}>
        <Ionicons name={icon} size={20} color={danger ? '#dc2626' : darkMode ? '#90ee90' : '#4CAF50'} />
        <Text style={[styles.label, danger && { color: '#dc2626' }, darkMode && !danger && styles.labelDark]}>
          {label}
        </Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={darkMode ? '#aaa' : '#555'} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, darkMode && styles.safeDark]}>
      <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDark]}>
        <Text style={[styles.header, darkMode && styles.headerDark]}>Settings</Text>

        <Text style={[styles.section, darkMode && styles.sectionDark]}>Preferences</Text>
        <SettingItem
          label="Dark Mode"
          icon="moon-outline"
          isSwitch
          value={darkMode}
          onValueChange={toggleTheme}  // Use toggle from context
        />
        <SettingItem
          label="Enable Notifications"
          icon="notifications-outline"
          isSwitch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />

        <Text style={[styles.section, darkMode && styles.sectionDark]}>Account</Text>
        <SettingItem
          label="Change Password"
          icon="key-outline"
          onPress={() => Alert.alert('Coming Soon', 'This feature is in development.')}
        />
        <SettingItem
          label="Clear Local Data"
          icon="trash-outline"
          onPress={handleClearData}
        />
        <SettingItem
          label="Logout"
          icon="log-out-outline"
          onPress={handleLogout}
          danger
        />

        <Text style={[styles.section, darkMode && styles.sectionDark]}>Legal & Support</Text>
        <SettingItem
          label="Privacy Policy"
          icon="document-text-outline"
          onPress={handlePrivacyPolicy}
        />
        <SettingItem
          label="Contact Support"
          icon="mail-outline"
          onPress={handleContactSupport}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeDark: {
    backgroundColor: '#121212',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 20,
  },
  headerDark: {
    color: '#e0e0e0',
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionDark: {
    color: '#9ca3af',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  itemDark: {
    borderColor: '#333',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  labelDark: {
    color: '#e0e0e0',
  },
});
