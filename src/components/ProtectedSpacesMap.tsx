import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

import {DEFAULT_MAP_REGION, DEFAULT_MAP_DELTAS} from '../utils/constants';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import {useLocationContext} from '../contexts/locationContext';
import type {ProtectedSpace} from '../utils/types';
import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStack';

const ProtectedSpacesMap = () => {
  const navigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocationContext();
  const {protectedSpaces} = useProtectedSpacesContext();

  const handleMarkerPress = (space: ProtectedSpace) => {
    navigation.navigate('protectedSpaceDetailsScreen', {
      id: space.id,
    });
  };

  return (
    <MapView
      style={styles.container}
      provider={PROVIDER_GOOGLE}
      region={
        location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
              longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
            }
          : DEFAULT_MAP_REGION
      }
      showsUserLocation>
      {location &&
        protectedSpaces.map(space => (
          <Marker
            key={space.id}
            coordinate={{
              latitude: space.coordinate.latitude,
              longitude: space.coordinate.longitude,
            }}
            onPress={() => handleMarkerPress(space)}
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
