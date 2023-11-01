import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';

import useLocation from '../hooks/useLocation';

const DEFAULT_LATITUDE_DELTA = 0.05;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: DEFAULT_LATITUDE_DELTA,
                longitudeDelta: DEFAULT_LONGITUDE_DELTA,
              }
            : undefined
        }
        showsUserLocation
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
