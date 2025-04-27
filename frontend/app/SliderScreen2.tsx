import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SliderScreen2 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Safety, Our Priority</Text>
      <Text style={styles.subtitle}>
        Safenaari equips you with smart tools and instant support for safe journeys—anytime, anywhere.
      </Text>

      <Image
        source={require('../assets/images/women_empowerment2.png')} // Place this image in your assets folder
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SliderScreen3')}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('signup')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8bbd0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 30,
  },
  image: {
    width: 260,
    height: 260,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#ad1457',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#880e4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SliderScreen2;
