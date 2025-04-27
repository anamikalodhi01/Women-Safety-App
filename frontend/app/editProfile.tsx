import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const EditProfile = () => {
  const navigation = useNavigation(); // Hook to access navigation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fakeCallerName, setFakeCallerName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setName(parsedUser.name || '');
        setEmail(parsedUser.email || '');
        setPhone(parsedUser.phone || '');
        setFakeCallerName(parsedUser.fakeCallerName || '');
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const updatedData = {
        name,
        email,
        phone,
        fakeCallerName
      };

      console.log('Sending updated data:', updatedData);
      console.log('Token being sent:', token);

      const res = await axios.put(`${BASE_URL}/users/editProfile`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Update successful:', res.data);
      Alert.alert('Success', 'Profile updated successfully!');

      await AsyncStorage.setItem('user', JSON.stringify(res.data.updatedUser));
    } catch (error) {
      console.log('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      Alert.alert('Logged out', 'You have been logged out successfully');
      navigation.replace('login'); // Adjust the route name if different
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Fake Caller Name"
        value={fakeCallerName}
        onChangeText={setFakeCallerName}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4ec',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#880e4f',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#ad1457',
    padding: 15,
    borderRadius: 30,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default EditProfile;
