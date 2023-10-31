import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {
  type UserLocationChangeEvent,
  type LatLng,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
});

const ProtectedSpacesMapScreen = () => {
  const [latLng, setLatLng] = useState<LatLng | null>(null);

  const handleGetInitialLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLatLng({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      _ => {},
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  }, []);

  const handleLocationChange = (e: UserLocationChangeEvent) => {
    if (e.nativeEvent.coordinate) {
      setLatLng({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      });
    }
  };

  useEffect(() => {
    handleGetInitialLocation();
  }, [handleGetInitialLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        region={
          latLng
            ? {
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                ...latLng,
              }
            : undefined
        }
        showsUserLocation
        onUserLocationChange={handleLocationChange}
      />
    </View>
  );
};

export default ProtectedSpacesMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});
