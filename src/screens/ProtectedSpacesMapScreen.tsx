import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';

import useLocation from '../hooks/useLocation';

const ProtectedSpacesMapScreen = () => {
  const {location} = useLocation();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        region={
          location
            ? {
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                ...location,
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
