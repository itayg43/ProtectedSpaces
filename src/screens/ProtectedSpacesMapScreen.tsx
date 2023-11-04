import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import useLocation from '../hooks/useLocation';
import {type ProtectedSpace} from '../utils/types';
import ProtectedSpaceCard from '../components/ProtectedSpaceCard';
import authService from '../services/authService';
import protectedSpacesService from '../services/protectedSpacesService';
import {useProtectedSpacesContext} from '../contexts/ProtectedSpacesContext';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();
  const {protectedSpaces, setProtectedSpaces} = useProtectedSpacesContext();
  const [selectedProtectedSpace, setSelectedProtectedSpace] =
    useState<ProtectedSpace | null>(null);

  const handleMarkerPress = (space: ProtectedSpace) => {
    setSelectedProtectedSpace(space);
  };

  const handleCloseSpaceCard = () => {
    setSelectedProtectedSpace(null);
  };

  useEffect(() => {
    const protectedSpacesUnsubscribe =
      protectedSpacesService.collectionSubscription(spaces =>
        setProtectedSpaces(spaces),
      );

    return protectedSpacesUnsubscribe;
  }, [setProtectedSpaces]);

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
            coordinate={{
              latitude: space.coordinate.latitude,
              longitude: space.coordinate.longitude,
            }}
            onPress={() => handleMarkerPress(space)}
          />
        ))}
      </MapView>

      <View style={styles.signOutButtonContainer}>
        <Button title="Logout" onPress={async () => authService.signOut()} />
      </View>

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

  signOutButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
  },

  protectedSpaceCardContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '90%',
  },
});
