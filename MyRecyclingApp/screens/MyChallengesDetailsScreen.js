import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

const { width } = Dimensions.get('window');

export default function MyChallengesDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userChallengeId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [progress, setProgress] = useState({});
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

 const fetchChallenge = useCallback(async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${API_BASE_URL}/api/user-challenges/by-challenge/${userChallengeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('API Response:', res.data); // Debug log
    setChallenge(res.data.challengeId);
    setProgress(res.data.progress || {});
  } catch (err) {
    console.error('Error loading challenge details:', err.message);
    console.error('Full error:', err.response?.data); // More detailed error
    Alert.alert('Error', 'Failed to load challenge details');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [userChallengeId]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChallenge();
  }, [fetchChallenge]);

  const handleToggle = async (dayKey, value) => {
    try {
      const token = await AsyncStorage.getItem('token');
      setProgress((prev) => ({ ...prev, [dayKey]: value }));

      await axios.patch(
        `${API_BASE_URL}/api/userChallenges/${userChallengeId}/progress`,
        { taskKey: dayKey, completed: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error updating progress:', err.message);
      console.error('Full error:', err.response?.data); // More detailed error
      Alert.alert('Error', 'Failed to update progress');
      // Revert the optimistic update
      setProgress((prev) => ({ ...prev, [dayKey]: !value }));
    }
  };

  const handleNumericInput = (dayKey) => {
    setSelectedDay(dayKey);
    setInputValue(progress[dayKey]?.toString() || '');
    setShowInputModal(true);
  };

  const submitNumericInput = async () => {
    if (!selectedDay || inputValue.trim() === '') return;

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const numericValue = parseFloat(inputValue);
      
      if (isNaN(numericValue) || numericValue < 0) {
        Alert.alert('Invalid Input', 'Please enter a valid positive number');
        return;
      }

      setProgress((prev) => ({ ...prev, [selectedDay]: numericValue }));

      await axios.patch(
        `${API_BASE_URL}/api/userChallenges/${userChallengeId}/progress`,
        { taskKey: selectedDay, completed: numericValue }, // Use 'completed' field for consistency
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowInputModal(false);
      setInputValue('');
      setSelectedDay(null);
    } catch (err) {
      console.error('Error updating numeric progress:', err.message);
      Alert.alert('Error', 'Failed to update progress');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !challenge) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  const dayCount = Math.ceil(
    (new Date(challenge.endDate) - new Date(challenge.startDate)) / (1000 * 60 * 60 * 24)
  ) + 1;
  const days = Array.from({ length: dayCount }, (_, i) => `day${i + 1}`);

  // Calculate statistics
  const completedDays = days.filter(day => progress[day]).length;
  const completionRate = Math.round((completedDays / dayCount) * 100);
  const streak = calculateStreak(days, progress);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={2}>
          {challenge?.title ?? 'Challenge'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedDays}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${completionRate}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {completedDays} of {dayCount} days completed
        </Text>
      </View>

      {/* Challenge Description */}
      {challenge.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{challenge.description}</Text>
        </View>
      )}

      {/* Days List */}
      <FlatList
        data={days}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => {
          const isCompleted = Boolean(progress[item]);
          const dayNumber = index + 1;
          const isToday = isCurrentDay(challenge.startDate, index);
          
          return (
            <View style={[
              styles.dayRow,
              isCompleted && styles.completedRow,
              isToday && styles.todayRow
            ]}>
              <View style={styles.dayInfo}>
                <Text style={[
                  styles.dayText,
                  isCompleted && styles.completedText,
                  isToday && styles.todayText
                ]}>
                  Day {dayNumber}
                </Text>
                {isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Today</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.dayActions}>
                {challenge.type === 'numeric' ? (
                  <TouchableOpacity
                    style={styles.numericButton}
                    onPress={() => handleNumericInput(item)}
                  >
                    <Text style={styles.numericButtonText}>
                      {progress[item] || 0}
                    </Text>
                    <Ionicons name="create-outline" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                ) : (
                  <Switch
                    value={isCompleted}
                    onValueChange={(val) => handleToggle(item, val)}
                    trackColor={{ false: '#E5E7EB', true: '#4CAF50' }}
                    thumbColor={isCompleted ? '#fff' : '#f4f3f4'}
                  />
                )}
                
                {isCompleted && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Numeric Input Modal */}
      <Modal
        visible={showInputModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInputModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Enter Progress for {selectedDay?.replace('day', 'Day ')}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter value"
              keyboardType="numeric"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowInputModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitNumericInput}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper functions
function calculateStreak(days, progress) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (progress[days[i]]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function isCurrentDay(startDate, dayIndex) {
  const start = new Date(startDate);
  const currentDay = new Date(start.getTime() + (dayIndex * 24 * 60 * 60 * 1000));
  const today = new Date();
  
  return currentDay.toDateString() === today.toDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  descriptionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  completedRow: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  todayRow: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  dayInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  todayText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  todayBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  todayBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numericButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  numericButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});