import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from 'axios'; // Import axios for HTTP requests

const settings = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [fakeCallerName, setFakeCallerName] = useState(user.fakeCallerName);

  const handleSaveChanges = async () => {
    // Prepare the object with only non-empty fields
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (fakeCallerName) updatedData.fakeCallerName = fakeCallerName;

    try {
      const response = await axios.put(
        'https://your-api-url.com/api/user/editProfile', 
        updatedData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Handle success
      Alert.alert("Profile Updated", "Your profile has been updated successfully!");
    } catch (error) {
      // Handle error
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.profileName}>Edit Profile</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {/* Name Field */}
          <View style={styles.inputWrapper}>
            <FontAwesome name="user" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="black"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone Field */}
          <View style={styles.inputWrapper}>
            <FontAwesome name="phone" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone no"
              placeholderTextColor="black"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputWrapper}>
            <FontAwesome name="envelope" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email id"
              placeholderTextColor="black"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Fake Caller Name Field */}
          <View style={styles.inputWrapper}>
            <FontAwesome name="user" size={20} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Fake Caller Name"
              placeholderTextColor="black"
              value={fakeCallerName}
              onChangeText={setFakeCallerName}
            />
          </View>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleSaveChanges}>
          <Text style={styles.editButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8bbd0",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 100,
  },
  header: {
    width: "100%",
    backgroundColor: "white",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
    paddingVertical: 40,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    width: "85%",
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 45,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  editButton: {
    backgroundColor: "#f472b6",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default settings;
