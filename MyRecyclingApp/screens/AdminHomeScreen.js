import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AdminDashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ManageChallenges')}
      >
        <Text style={styles.buttonText}>Manage Challenges</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ChallengeApproval')}
      >
        <Text style={styles.buttonText}>Approve Challenges</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RecyclingGuide')}
      >
        <Text style={styles.buttonText}>Edit Guides</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AdminProfile')}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#388E3C',
  },
  button: {
    width: '80%',
    backgroundColor: '#9DD549',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});
