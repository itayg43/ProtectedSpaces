import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import useLocation from '../hooks/useLocation';
import {type ProtectedSpace} from '../utils/types';
import {protectedSpaces} from '../utils/dammyData';
import ProtectedSpaceCard from '../components/ProtectedSpaceCard';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();

  const [selectedProtectedSpace, setSelectedProtectedSpace] =
    useState<ProtectedSpace | null>(null);

  const handleMarkerPress = (space: ProtectedSpace) => {
    setSelectedProtectedSpace(space);
  };

  const handleCloseSpaceCard = () => {
    setSelectedProtectedSpace(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
        showsUserLocation>
        {protectedSpaces.map(space => (
          <Marker
            key={space.id}
            coordinate={space.coordinate}
            onPress={() => handleMarkerPress(space)}
          />
        ))}
      </MapView>

      {selectedProtectedSpace && (
        <ProtectedSpaceCard
          contentContainerStyle={styles.protectedSpaceCardContainer}
          protectedSpace={selectedProtectedSpace}
          onClose={handleCloseSpaceCard}
        />
      )}
    </View>
  );
};

export default ProtectedSpacesMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  protectedSpaceCardContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '85%',
  },
});
