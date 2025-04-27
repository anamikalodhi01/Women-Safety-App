import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../constants'; // Ensure this points to your backend IP or deployed URL

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/HomeScreen');
      }
    };
    checkToken();
  }, []);

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users/register`, {
        name,
        email,
        phone,
        password,
      });

      if (res.data?.token) {
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
        router.replace('/HomeScreen');
      } else {
        Alert.alert('Signup failed', 'Please try again.');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        Alert.alert('Error', axiosError.response.data?.error || 'Something went wrong');
      } else {
        Alert.alert('Error', axiosError.message);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fce4ec', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/images/logo.png')} style={{ width: 200, height: 200, marginBottom: 20 }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#880e4f' }}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={inputStyle}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={inputStyle}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
      />

      <TouchableOpacity
        style={buttonStyle}
        onPress={handleSignup}
      >
        <Text style={buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={{ marginTop: 20, color: '#880e4f', textDecorationLine: 'underline' }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const inputStyle = {
  width: 300,
  padding: 12,
  marginVertical: 10,
  borderRadius: 10,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
};

const buttonStyle = {
  backgroundColor: '#ad1457',
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 30,
  marginTop: 20,
};

const buttonText = {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
};

export default Signup;
