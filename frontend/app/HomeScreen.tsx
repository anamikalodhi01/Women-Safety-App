import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, TouchableWithoutFeedback, Linking } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons'; // Feather has a good 'edit' icon
import { useRouter } from 'expo-router';
import axios from 'axios'
import { BASE_URL } from "../constants";

interface user {
  name: string 
  email: string 
  phone: string 
  friends: any[]
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<string | null>(null);
  const [user, setUser] = useState<user | null>(null);
  const router = useRouter();

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(Date.now());

  const handleScreenTap = () => {
    const now = Date.now();

    // Reset tap count if 5 seconds passed between taps
    if (now - lastTapRef.current > 5000) {
      tapCountRef.current = 0;
    }

    tapCountRef.current += 1;
    lastTapRef.current = now;

    if (tapCountRef.current >= 10) {
      tapCountRef.current = 0; // Reset
      shareLocation(); // Trigger emergency SMS
      Alert.alert("Emergency Triggered", "Your location has been shared!");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log(token)
      
      const response = await axios.post(`${BASE_URL}/users/getUser`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })



      if (response.status === 200) {
        return setUser(response.data.data)
      }
   
  }

  fetchUser()
}, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation("Permission to access location was denied.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const { city, region, country } = geocode[0];
        setLocation(`${city}, ${region}, ${country}`);
      } else {
        setLocation("Unable to determine location.");
      }
    };

    getLocation();
  }, []);

  const shareLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }

    const token = await AsyncStorage.getItem('token')

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const { city, region, country } = geocode[0] || {};

      const locationText = city && region && country
        ? `${city}, ${region}, ${country}`
        : `${latitude}, ${longitude}`;

      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = `⚠️ She is in danger!\nCurrent Location: ${locationText}\nTrack here: ${mapsLink}`;

      const response: any = await axios.post(`${BASE_URL}/users/getUser`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const phoneNumbers = response.data.data.friends.map((item: any) => item.phone)
      const smsRecipients = phoneNumbers.join(",");
      const smsUrl = `sms:${smsRecipients}?body=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert("Error", "SMS app not available on this device.");
      }
    } catch (err) {
      console.error("Location sharing error:", err);
      Alert.alert("Error", "Unable to send location.");
    }
  };

 

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View className="flex-1 bg-pink-200">
        {/* Header */}
        <View className="bg-pink-300 p-10 pb-14 pt-14 flex-row justify-between items-center">
          <View>
            <Text className="text-lg text-gray-800 font-medium">Hey there👋,</Text>
            <Text className="text-3xl font-bold text-black">{user?.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
            <TouchableOpacity onPress={() => {
                router.push({
                  pathname: '/editProfile',
                  
                });
            }}>
              <Feather name="edit" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView className="bg-white flex-1 rounded-t-[50px] -mt-5 p-5">
          <View className="flex-row justify-around mb-7">
            <TouchableOpacity
              className="items-center bg-gray-100 p-4 rounded-lg"
              onPress={() => navigation.navigate('FakeCallScreen')}
            >
              <FontAwesome5 name="phone-alt" size={24} color="black" />
              <Text className="text-base mt-2">Fake Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center bg-gray-100 p-4 rounded-lg">
              <Ionicons name="location" size={24} color="black" />
              <Text className="text-base mt-2 justify-center">Tap 10 Times On Screen &{"\n"}Share Live Location</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-100 p-5 rounded-lg mb-3">
            <Text className="text-lg font-bold mb-2">Your Current Location</Text>
            <Text className="text-gray-600">{location || "Fetching location..."}</Text>
          </View>

          <View className="bg-gray-100 p-5 rounded-lg mb-3">
            <Text className="text-lg font-bold">Start a Journey 🚀</Text>
            <Text className="text-gray-600">Track your route in real-time</Text>

            <TouchableOpacity
              className="bg-pink-400 p-4 rounded-lg mt-3"
              onPress={() => navigation.navigate('LiveLocationMap')}
            >
              <Text className="text-white font-semibold text-center">Track My Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-pink-400 p-4 rounded-lg mt-3"
              onPress={shareLocation}
            >
              <Text className="text-white font-semibold text-center">Share My Location</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-100 p-5 rounded-lg mb-3">
            <Text className="text-lg font-bold mb-2">Add Close People</Text>
            <TouchableOpacity
              className="bg-pink-400 p-4 rounded mt-2"
              onPress={() => navigation.navigate('AddFriend')}
            >
              <Text className="text-white font-semibold text-center">Add Friends</Text>
            </TouchableOpacity>
          </View>
         
          <View className="bg-gray-100 p-5 rounded-lg mb-3 gap-2">
            <Text className="text-lg font-bold mb-2">Emergency Contacts</Text>
          
            <View className="flex-row justify-between space-x-4 gap-2">
              <TouchableOpacity
                className="bg-pink-400 p-4 rounded-lg items-center flex-1"
                onPress={() => Linking.openURL('tel:+100')}
              >
                <Text className="text-white font-semibold text-base">Call Police</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-400 p-4 rounded-lg items-center flex-1"
                onPress={() => Linking.openURL('tel:+101')}
              >
                <Text className="text-white font-semibold text-base">Call <Text className="text-3xl">🚑</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-400 p-4 rounded-lg items-center flex-1"
                onPress={() => Linking.openURL('tel:+181')}
              >
                <Text className="text-white font-semibold text-base">Women Helpline</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {user ? (
                <>
                  <Text style={{ fontSize: 22 }}>Welcome, {user.name}!</Text>
                  <Text>Email: {user.email}</Text>
                  <Text>Phone: {user.phone}</Text>
                  <Text>{user._id}</Text>
                </>
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;
