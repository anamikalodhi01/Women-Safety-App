import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../global.css"; // Import global CSS here if using web

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null); // Initial state is null to wait for check
  const navigation = useNavigation();

  // Check if the user is logged in using AsyncStorage
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('token');
      if (userToken) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    };

    checkLoginStatus();
  }, []);

  // Perform navigation after login status is determined
  useEffect(() => {
    if (isLoggedIn === null) {
      return; // Don't navigate until login status is known
    }

    if (isLoggedIn) {
      navigation.replace('HomeScreen'); // If logged in, navigate to HomeScreen
    } else {
      navigation.replace('SliderScreen1'); // If not logged in, show slider
    }
  }, [isLoggedIn, navigation]);

  // Show a loading indicator while checking login status
  if (isLoggedIn === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#880e4f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAFENAARI</Text>
      {/* Settings and slider links for testing purposes */}
      <Link href="./signup" style={styles.link}>Settings</Link>
      <Link href="./slider" style={styles.link}>Slider</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8bbd0', // Pink background
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#880e4f', // Dark pink color
    marginBottom: 20,
  },
  link: {
    color: '#ad1457', // Pink color
    fontWeight: '600',
    marginTop: 10,
    fontSize: 18,
  },
});

export default Index;
