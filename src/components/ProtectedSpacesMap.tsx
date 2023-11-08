import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import protectedSpacesService from '../services/protectedSpacesService';
import type {Location, ProtectedSpace} from '../utils/types';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

type Props = {
  location: Location | null;
  onMarkerPress: (protectedSpace: ProtectedSpace) => void;
};

const ProtectedSpacesMap = ({location, onMarkerPress}: Props) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      spaces => setProtectedSpaces(spaces),
      error => Alert.alert('Error', error.message),
    );

    return unsubscribe;
  }, []);

  return (
    <MapView
      style={styles.container}
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
      loadingEnabled>
      {location &&
        protectedSpaces.map(space => (
          <Marker
            key={space.id}
            coordinate={{
              latitude: space.coordinate.latitude,
              longitude: space.coordinate.longitude,
            }}
            onPress={() => onMarkerPress(space)}
          />
        ))}
    </MapView>
  );
};

export default ProtectedSpacesMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
