import React from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

import {DEFAULT_MAP_REGION, DEFAULT_MAP_DELTAS} from '../utils/constants';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import {useLocationContext} from '../contexts/locationContext';
import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStack';

const ProtectedSpacesMap = () => {
  const navigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocationContext();
  const {protectedSpaces} = useProtectedSpacesContext();

  const handleMarkerPress = (id: string) => {
    navigation.navigate('protectedSpaceDetailsScreen', {
      id,
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
        protectedSpaces.map(s => (
          <Marker
            key={s.id}
            coordinate={{
              latitude: s.address.latLng.latitude,
              longitude: s.address.latLng.longitude,
            }}
            onPress={() => handleMarkerPress(s.id)}
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
