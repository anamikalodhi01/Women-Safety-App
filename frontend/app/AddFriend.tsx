import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../constants';

const AddFriend = () => {
  const [fullName, setFullName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<{name: string; phone: string }[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      const token = await AsyncStorage.getItem('token')

      const response = await axios.post(`${BASE_URL}/users/getUser`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        setFriends(response.data.data.friends)
      }
    }

    getFriends()
  }, [])

  const navigation = useNavigation();

  const handleAddFriend = async () => {
    if (!fullName || !contactNumber) {
      Alert.alert('Error', 'Please provide both name and contact number');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to add a friend');
        setLoading(false);
        return;
      }

    const response = await axios.post(`${BASE_URL}/users/add`, {name: fullName, phone: contactNumber}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.status === 200) {
      setFriends((prev) => [...prev, {name: fullName, phone: contactNumber}]);

      Alert.alert('Success', 'Friend added successfully!');
      setFullName('');
      setContactNumber('');
    }
      
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (phone: string) => {

    const token = await AsyncStorage.getItem('token')

    Alert.alert('Delete Friend', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await axios.post(`${BASE_URL}/users/delete`, {phone: phone}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.status === 200) {
            const updatedFriends = friends.filter((item) => item.phone !== phone)
            setFriends(updatedFriends)
          }
        }
      }
    ]);
  };

  return (
    <View className="bg-pink-200 w-screen h-screen p-4 pt-14">
      <Text className="text-pink-600 text-4xl font-extrabold text-center">Add a Friend</Text>

      <View className="items-center mt-6">
        <TextInput
          className="w-80 bg-white p-4 rounded-2xl mb-4 border border-gray-300"
          placeholder="Enter Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          className="w-80 bg-white p-4 rounded-2xl mb-4 border border-gray-300"
          placeholder="Enter Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          className="w-64 bg-pink-700 p-4 rounded-3xl mt-4"
          onPress={handleAddFriend}
          disabled={loading}
        >
          <Text className="text-white font-bold text-2xl text-center">
            {loading ? 'Adding...' : 'Add Friend'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-bold text-pink-700 mt-8 mb-3">Your Friends</Text>

      {Array.isArray(friends) && <FlatList
        data={friends}
        keyExtractor={(item: any) => item.name}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold text-pink-800">{item.name}</Text>
              <Text className="text-gray-600">{item.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => {console.log(item.phone); handleDeleteFriend(item.phone)}}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />}
    </View>
  );
};

export default AddFriend;
