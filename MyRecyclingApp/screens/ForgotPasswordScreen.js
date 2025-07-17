import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Update path based on your structure

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

 const handleReset = async () => {
  if (!email.trim()) {
    Alert.alert('Error', 'Please enter your email address.');
    return;
  }

  try {
    setLoading(true);
    const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });

    Alert.alert('Success', response.data.message || 'Reset code sent to your email.');
    navigation.navigate('ResetCode', { email }); 
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.inner}
      >
        <Text style={styles.header}>Forgot Password?</Text>
        <Text style={styles.subtext}>
            Don’t worry! It happens. Please enter the email associated with your account below. 
          
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // adjust to match your Figma BG color
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'left',
   
    
    
  },
  subtext: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 32,
    textAlign: 'left',
    
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    marginBottom: 24,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  link: {
    color: '#388E3C',
    fontSize: 15,
    textAlign: 'center',
  },
});
