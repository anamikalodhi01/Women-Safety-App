import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SliderScreen1 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safenaari</Text>
      <Text style={styles.subtitle}>Unleashing the Power Within Every Woman</Text>

      <Image
        source={require('../assets/images/women_empowerment1.png')} // make sure this image exists
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SliderScreen2')}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#880e4f',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#880e4f',
    textAlign: 'center',
    marginBottom: 30,
  },
  image: {
    width: 250,
    height: 250,
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

export default SliderScreen1;
