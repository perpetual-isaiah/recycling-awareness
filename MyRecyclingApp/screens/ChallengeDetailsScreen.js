import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export default function ChallengeDetailsScreen({ route, navigation }) {
  const { challengeId } = route.params;
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChallengeDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/challenges/${challengeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallenge(response.data);
    } catch (error) {
      console.error('Error loading challenge details:', error);
      Alert.alert('Error', 'Failed to load challenge details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#388E3C" />
      </View>
    );
  }

  if (!challenge) {
    return null; // or some fallback UI
  }

  // Format dates nicely
  const startDate = new Date(challenge.startDate).toLocaleDateString();
  const endDate = new Date(challenge.endDate).toLocaleDateString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Participants:</Text>
          <Text style={styles.value}>{challenge.participantsCount ?? 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{startDate}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>{endDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Participate?</Text>
          <Text style={styles.sectionText}> {challenge.whyParticipate?.trim() || 'No details provided.'}
        </Text>

        </View>
        
        {/* Add more sections as needed */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4A6B4D',
    marginBottom: 24,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  value: {
    fontSize: 16,
    color: '#4A6B4D',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#4A6B4D',
    lineHeight: 22,
  },
});
