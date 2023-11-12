import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import type {Location, ProtectedSpace} from '../utils/types';
import {DEFAULT_MAP_DELTAS} from '../utils/constants';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';

type Props = {
  location: Location | null;
  onMarkerPress: (protectedSpace: ProtectedSpace) => void;
};

const ProtectedSpacesMap = ({location, onMarkerPress}: Props) => {
  const {protectedSpaces} = useProtectedSpacesContext();

  return (
    <MapView
      style={styles.container}
      region={
        location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
              longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
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
