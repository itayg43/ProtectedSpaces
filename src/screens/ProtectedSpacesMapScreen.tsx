import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import useLocation from '../hooks/useLocation';
import protectedSpacesService from '../services/protectedSpacesService';
import {useProtectedSpacesContext} from '../contexts/ProtectedSpacesContext';
import type {ProtectedSpace} from '../utils/types';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();

  const {protectedSpaces, setProtectedSpaces} = useProtectedSpacesContext();
  const [selectedProtectedSpace, setSelectedProtectedSpace] =
    useState<ProtectedSpace | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSpaceMarkerPress = (space: ProtectedSpace) => {
    setSelectedProtectedSpace(space);
  };

  const handleBottomSheetModalDismiss = () => {
    setSelectedProtectedSpace(null);
  };

  useEffect(() => {
    if (!selectedProtectedSpace) {
      return;
    }

    bottomSheetModalRef.current?.present();
  }, [selectedProtectedSpace]);

  useEffect(() => {
    const protectedSpacesUnsubscribe =
      protectedSpacesService.collectionSubscription(spaces =>
        setProtectedSpaces(spaces),
      );

    return protectedSpacesUnsubscribe;
  }, [setProtectedSpaces]);

  return (
    <BottomSheetModalProvider>
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
              onPress={() => handleSpaceMarkerPress(space)}
            />
          ))}
        </MapView>

        {selectedProtectedSpace && (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={['25%', '50%']}
            onDismiss={handleBottomSheetModalDismiss}>
            <View>
              <Text>{selectedProtectedSpace.address}</Text>
            </View>
          </BottomSheetModal>
        )}
      </View>
    </BottomSheetModalProvider>
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
});
