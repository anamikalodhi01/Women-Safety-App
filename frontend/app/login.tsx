import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/HomeScreen');
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Missing Fields', 'Please enter both email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/users/login`, {
        emailOrPhone,
        password,
      });

      if (res.data?.token) {
        await AsyncStorage.setItem('token', res.data.token);
        router.replace('/HomeScreen');
      } else {
        Alert.alert('Login Failed', 'No token received from server.');
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        Alert.alert('Login Error', axiosError.response.data?.error || 'Something went wrong');
        console.error('Error response:', axiosError.response.data);
      } else {
        Alert.alert('Network Error', axiosError.message);
        console.error('Network error:', axiosError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fce4ec', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/images/logo.png')} style={{ width: 200, height: 200, marginBottom: 20 }} />

      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#880e4f' }}>Welcome Back!</Text>

      <TextInput
        placeholder="Email or Phone"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        autoCapitalize="none"
        style={{
          width: 300,
          padding: 12,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: 300,
          padding: 12,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#ad1457',
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 30,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={{ marginTop: 20, color: '#880e4f', textDecorationLine: 'underline' }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
