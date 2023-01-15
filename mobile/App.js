import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function App() {
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("dont have permission");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLongitude(currentLocation.coords.longitude);
      setLatitude(currentLocation.coords.latitude);
    };
    getPermissions();
  }, []);

  const onButtonClick = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/position/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    });
    const data = await response.json();
    if (data) {
      alert("success");
    } else {
      alert("invalid");
    }
    console.log("DATA", data);
  };

  return (
    <View style={styles.container}>
      <Button onPress={onButtonClick} title="HAIDE!" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
