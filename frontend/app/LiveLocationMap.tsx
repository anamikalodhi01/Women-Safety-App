import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

interface LocationType {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const LiveLocationMap = () => {
  const [location, setLocation] = useState<LocationType | null>(null);

  // Coordinates of Chamuhan
  const chamuhanLocation = {
    latitude: 27.6206,
    longitude: 77.6399,
  };

  // Coordinates of Jait
  const jaitLocation = {
    latitude: 27.5789,
    longitude: 77.6096,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (newLoc) => setLocation(newLoc)
      );

      return () => subscriber.remove();
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="hotpink" size="large" />
      </View>
    );
  }

  const region: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        followsUserLocation
        region={region}
      >
        <Marker coordinate={location.coords} title="You're here" />
        <Marker coordinate={chamuhanLocation} title="Chamuhan" pinColor="red" />
        <Marker coordinate={jaitLocation} title="Jait (Criminal Route)" pinColor="red" />
        
        {/* Mark the route from Chamuhan to Jait */}
        <Polyline
          coordinates={[chamuhanLocation, jaitLocation]}
          strokeColor="red"  // This makes the route red
          strokeWidth={4}    // This controls the thickness of the line
        />
        <Marker coordinate={jaitLocation} title="Jait" pinColor="red" />
        <Marker coordinate={chamuhanLocation} title="Chamuhan" pinColor="red" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LiveLocationMap;
