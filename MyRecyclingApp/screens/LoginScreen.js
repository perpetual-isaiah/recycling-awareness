import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { API_BASE_URL } from '../config'; // Adjust path as needed


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


const handleLogin = async () => {
  if (!email || !password) {
    setError('Please enter both email and password');
    return;
  }

  try {
    setLoading(true);
    setError(''); // Clear previous errors before trying

    const normalizedEmail = email.trim().toLowerCase();
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: normalizedEmail,
      password,
    });

    if (response.status === 200) {
      const { user, token } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

      Alert.alert('Success', `Welcome back, ${user.name}!`);

      // Clear error after success
      setError('');

      if (user.role === 'admin') {
        navigation.replace('Admin');
      } else {
        navigation.replace('LocationPermission');
      }
    } else {
      setError(response.data.message || 'Invalid credentials');
      setPassword('');
    }
  } catch (error) {
    console.error('Login Error:', error);
    setError(error.response?.data?.message || 'Something went wrong');
    setPassword('');
  } finally {
    setLoading(false);
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hi, Welcome! 👋</Text>
     {/*  <Text style={styles.subtext}>Login to continue</Text> */}

      <View style={styles.inputContainer}>
       <TextInput
  placeholder="Email"
  style={styles.input}
  autoCapitalize="none"
  keyboardType="email-address"
  onChangeText={(text) => {
    setEmail(text);
    if (error) setError('');
  }}
  value={email}
  editable={!loading}
/>

        
  <View style={styles.passwordWrapper}>
  <TextInput
  placeholder="Password"
  style={styles.passwordInput}
  secureTextEntry={!showPassword}
  onChangeText={(text) => {
    setPassword(text);
    if (error) setError('');
  }}
  value={password}
  editable={!loading}
/>
  <TouchableOpacity
    onPress={() => setShowPassword((prev) => !prev)}
    style={styles.eyeIcon}
    activeOpacity={0.6}
  >
    <Ionicons
      name={showPassword ? 'eye' : 'eye-off'}
      size={22}
      color="#888"
    />
  </TouchableOpacity>
</View>
{error ? (
  <Text style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>
    {error}
  </Text>
) : null}

        
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={rememberMe ? 'checked' : 'unchecked'}
          onPress={() => setRememberMe(!rememberMe)}
          color="#388e3c"
          uncheckedColor="#999"
          disabled={loading}
        />
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View>

<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={loading}>
  <Text style={styles.forgotPassword}>Forgot Password?</Text>
</TouchableOpacity>

     
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

          <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR Login with</Text>
        <View style={styles.line} />
      </View>

       <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="logo-google" size={28} color="#DB4437" />
      </TouchableOpacity>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="logo-facebook" size={28} color="#1877F2" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.iconButton}>
    <Ionicons name="logo-apple" size={28} color="#000" />
   </TouchableOpacity>
      </View>



      <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',       //'#F5FEED', //#F4FEED
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  header: {
     marginTop: 150,
    paddingHorizontal: 40,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4D3E3E', //1B5E20
    marginBottom: 32,
    textAlign: 'left',
  },
  subtext: {
    paddingHorizontal: 40,
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 32,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8DADC', //c8e6c9 
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    color: '#000000', //388E3C     
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 24,
    paddingHorizontal: 8,
    maxWidth: 340,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#9DD549', //388E3C 
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  link: {
    color: '#000000',
    fontSize: 15,
    textAlign: 'center',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#388E3C',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#000000',//4CAF50
    fontWeight: '600',
    fontSize: 14,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 8,
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8DADC', // A5D6A7
  },

 passwordWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#D8DADC',
  paddingHorizontal: 14,
  marginBottom: 16,
  width: '100%',
  maxWidth: 340,
  alignSelf: 'center',
},

passwordInput: {
  flex: 1,
  paddingVertical: 14,
  fontSize: 16,
},

eyeIcon: {
  marginLeft: 10,
},


});

