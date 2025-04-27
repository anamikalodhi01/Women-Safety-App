import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const FakeCallScreen = () => {
  const navigation = useNavigation();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const playRingtone = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/nokia.mp3"),
          { shouldPlay: true, isLooping: true }
        );
        soundRef.current = sound;
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    };

    playRingtone();

    return () => {
      stopRingtone();
      stopTimer();
    };
  }, []);

  const stopRingtone = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAcceptCall = async () => {
    await stopRingtone();
    setCallAccepted(true);
    setCallDuration(0);
    startTimer();
  };

  const handleEndCall = async () => {
    stopTimer();
    await stopRingtone();
    navigation.goBack();
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      {!callAccepted ? (
        <>
          <Text style={styles.contactName}>Mom</Text>
          <Text style={styles.label}>mobile</Text>

          <View style={styles.actionRow}>
            <View style={styles.iconSet}>
              <Text style={styles.iconLabel}>Remind Me</Text>
            </View>
            <View style={styles.iconSet}>
              <Text style={styles.iconLabel}>Message</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: "#d32f2f" }]}
              onPress={handleEndCall}
            >
              <Text style={styles.circleText}>📞</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, { backgroundColor: "#388e3c" }]}
              onPress={handleAcceptCall}
            >
              <Text style={styles.circleText}>📞</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.contactName}>Mom</Text>
          <Text style={styles.timer}>{formatDuration(callDuration)}</Text>

          <View style={styles.grid}>
            {[
              { label: "mute", icon: require("../assets/icons/mute.png") },
              { label: "keypad", icon: require("../assets/icons/dial.png") },
              { label: "speaker", icon: require("../assets/icons/volume.png") },
              { label: "add call", icon: require("../assets/icons/add-user.png") },
              { label: "FaceTime", icon: require("../assets/icons/facetime.png") },
              { label: "record", icon: require("../assets/icons/button.png") },
            ].map(({ label, icon }) => (
              <View style={styles.gridItem} key={label}>
                <View style={styles.iconButton}>
                  <Image source={icon} style={styles.iconImage} />
                </View>
                <Text style={styles.gridText}>{label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.endCallButton, { backgroundColor: "#d32f2f" }]}
            onPress={handleEndCall}
          >
            <Text style={styles.circleText}>📞</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default FakeCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FDEEF4"
  },
  contactName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f0f0f",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#0f0f0f",
    marginBottom: 40,
  },
  timer: {
    fontSize: 20,
    color: "#0f0f0f",
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 40,
  },
  iconSet: {
    alignItems: "center",
  },
  iconLabel: {
    color: "#0f0f0f",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  circleText: {
    color: "#0f0f0f",
    fontWeight: "bold",
    fontSize: 16,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  gridItem: {
    width: "30%",
    alignItems: "center",
    marginVertical: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8080804D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  gridText: {
    color: "#0f0f0f",
    fontSize: 12,
    textAlign: "center",
  },
});
