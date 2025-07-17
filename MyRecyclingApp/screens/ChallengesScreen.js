import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export default function CommunityChallengesScreen({ navigation }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      Alert.alert('Error', 'Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  };

 const handleJoin = async (challengeId, challengeTitle) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      `${API_BASE_URL}/api/challenges/${challengeId}/join`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Alert.alert('Challenge Joined', `You're now part of "${challengeTitle}"!`);
    
    // Remove the joined challenge from the displayed list
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge._id !== challengeId)
    );
  } catch (error) {
    console.error('Join error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'Failed to join challenge.');
  }
};


  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#388E3C" />
      </View>
    );
  }

  if (challenges.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noChallengesText}>No challenges available at the moment.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>🌱 Community Challenges</Text>
        <Text style={styles.globalHint}>Tap a challenge card to view full details.</Text>

        {challenges.map((challenge) => (
          <TouchableOpacity
            key={challenge._id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ChallengeDetails', { challengeId: challenge._id })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{challenge.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>

            <Text style={styles.description} numberOfLines={2}>{challenge.description}</Text>

            <View style={styles.buttonWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.glassyButton,
                  pressed && styles.glassyButtonPressed,
                ]}
                onPress={() => handleJoin(challenge._id, challenge.title)}
              >
                <Text style={styles.glassyButtonText}>Join</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  globalHint: {
    fontSize: 13,
    color: '#6BA36D',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFFCC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chevron: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C6E49',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#4A6B4D',
    marginBottom: 18,
    lineHeight: 22,
  },
  glassyButton: {
    backgroundColor: 'rgba(56, 142, 60, 0.3)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 142, 60, 0.7)',
    shadowColor: 'rgba(56, 142, 60, 0.5)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassyButtonPressed: {
    backgroundColor: 'rgba(56, 142, 60, 0.45)',
    shadowOpacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  glassyButtonText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'System',
  },
  buttonWrapper: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
  },
  noChallengesText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6A8E63',
    textAlign: 'center',
  },
});
