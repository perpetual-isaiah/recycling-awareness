// navigation/UserStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs'; 

// Import all your user-related screens here
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import MyChallengesScreen from '../screens/MyChallengesScreen';
import MyChallengesDetailsScreen from '../screens/MyChallengesDetailsScreen';
import MapScreen from '../screens/MapScreen';
import GuideScreen from '../screens/GuideScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import ResetCodeScreen from '../screens/ResetCodeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; 

const Stack = createNativeStackNavigator();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Community Challenges' }} />
      <Stack.Screen name="ChallengeDetails" component={ChallengeDetailsScreen} options={{ title: 'Challenge Details' }} />
      <Stack.Screen name="MyChallenges" component={MyChallengesScreen} options={{ title: 'My Challenges' }} />
      <Stack.Screen name="MyChallengesDetails" component={MyChallengesDetailsScreen} options={{ title: 'Challenge Details' }} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{ title: 'Map' }} />
      <Stack.Screen name="Guide" component={GuideScreen} options={{ title: 'Guides' }} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} options={{ title: 'Guide Details' }} />
      <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />

      <Stack.Screen name="MainApp" component={BottomTabs} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
