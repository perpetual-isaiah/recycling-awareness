import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// --------------------------
// CREATE TAB
// --------------------------
const CreateChallengeTab = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateObj, setStartDateObj] = useState(new Date());
  const [endDateObj, setEndDateObj] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const now = new Date();
    if (new Date(startDate) < now) {
      Alert.alert('Invalid Start Date', 'Start date cannot be in the past.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      Alert.alert('Invalid End Date', 'End date must be after start date.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/challenges`,
        {
          title,
          description,
          startDate,
          endDate,
          whyParticipate: why,
          approved: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Challenge created!');
      setTitle('');
      setDescription('');
      setWhy('');
      setStartDate('');
      setEndDate('');
      setStartDateObj(new Date());
      setEndDateObj(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create challenge');
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDateObj(selectedDate);
      setStartDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDateObj(selectedDate);
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContainer} keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
        <Text>{startDate ? `Start Date: ${startDate}` : 'Select Start Date'}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDateObj}
          mode="date"
          display="default"
          onChange={onChangeStartDate}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
        <Text>{endDate ? `End Date: ${endDate}` : 'Select End Date'}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDateObj}
          mode="date"
          display="default"
          onChange={onChangeEndDate}
          minimumDate={startDateObj}
        />
      )}

      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Why Participate?"
        value={why}
        onChangeText={setWhy}
        multiline
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Challenge</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --------------------------
// APPROVE TAB
// --------------------------
const ApproveChallengesTab = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallenges(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  const approveChallenge = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/challenges/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Approved', 'Challenge approved');
      fetchChallenges();
    } catch (err) {
      Alert.alert('Error', 'Failed to approve');
    }
  };

  const declineChallenge = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Declined', 'Challenge removed');
      fetchChallenges();
    } catch (err) {
      Alert.alert('Error', 'Failed to decline');
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {item.approved ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="hourglass" size={24} color="#FBBF24" />
            )}
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.meta}>Start: {new Date(item.startDate).toDateString()}</Text>
          <Text style={styles.meta}>End: {new Date(item.endDate).toDateString()}</Text>

          {!item.approved && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => approveChallenge(item._id)}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => declineChallenge(item._id)}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
};

// --------------------------
// MAIN SCREEN
// --------------------------
export default function AdminChallengesScreen() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tabContainerSwitcher}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create Challenge
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'approve' && styles.activeTab]}
          onPress={() => setActiveTab('approve')}
        >
          <Text style={[styles.tabText, activeTab === 'approve' && styles.activeTabText]}>
            Approve/Decline
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'create' ? <CreateChallengeTab /> : <ApproveChallengesTab />}
    </SafeAreaView>
  );
}

// --------------------------
// STYLES
// --------------------------
const styles = StyleSheet.create({
  tabContainerSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    margin: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#374151',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
