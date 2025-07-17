import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

export default function MyChallengesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const navigation = useNavigation();

  const fetchChallenges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/user/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJoinedChallenges(res.data.challenges || []);
      console.log('Fetched user challenges:', res.data);
    } catch (error) {
      console.error('Failed to fetch user challenges:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChallenges();
  }, []);

  const handleJoinChallenge = () => {
    navigation.navigate('Challenges');
  };

  const handleViewDetails = (challengeId) => {
    navigation.navigate('MyChallengesDetails', { userChallengeId: challengeId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {joinedChallenges.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You haven't joined any challenges yet.</Text>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinChallenge}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.joinButtonText}>Join a Challenge</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={joinedChallenges}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.dates}>
                {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''} -{' '}
                {item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}
              </Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleViewDetails(item._id)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleJoinChallenge}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#E6F4EA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  dates: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginLeft: 4,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
});
