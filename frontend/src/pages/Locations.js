import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

import "./map.css";

const Locations = () => {
  const [positions, setPositions] = useState();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("login");
  };

  const userProfileFromStorage = () => {
    if (localStorage.getItem("userInfo"))
      return JSON.parse(localStorage.getItem("userInfo")).accessToken;
    else navigate("login");
  };

  const getData = async () => {
    const res = await fetch(`http://localhost:8080/position/all`, {
      headers: { Authorization: `Bearer ${userProfileFromStorage()}` },
    });
    const data = await res.json();
    setPositions(data.positions);
    console.log("data", data);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyA3p9We5MfN6eF212KVCoWrffPBzdhfwD8",
  });

  React.useEffect(() => {
    getData();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <Map positions={positions} />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const Map = ({ positions }) => {
  const [center, setCenter] = useState({ lat: -32.950001, lng: -60.666668 });

  useEffect(() => {
    const handler = () => setCenter({ lat: 46.7576311, lng: 23.5603964 });
    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  }, []);

  return (
    <GoogleMap zoom={13} center={center} mapContainerClassName="map-container">
      {positions?.map((pos, key) => (
        <Marker
          key={key}
          position={{ lat: pos.latitude, lng: pos.longitude }}
        />
      ))}
    </GoogleMap>
  );
};

export default Locations;
