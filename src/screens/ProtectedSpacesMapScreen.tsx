import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import useLocation from '../hooks/useLocation';
import {useProtectedSpacesContext} from '../contexts/ProtectedSpacesContext';
import type {ProtectedSpace} from '../utils/types';
import ProtectedSpaceDetails from '../components/ProtectedSpaceDetails';
import AddProtectedSpaceModal from '../modals/AddProtectedSpaceModal';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();

  const {protectedSpaces} = useProtectedSpacesContext();
  const [selectedProtectedSpace, setSelectedProtectedSpace] =
    useState<ProtectedSpace | null>(null);

  const selectedProtectedSpaceBottomSheetModalRef =
    useRef<BottomSheetModal>(null);

  const [showAddProtectedSpaceModal, setShowAddProtectedSpaceModal] =
    useState(false);

  const handleToggleShowAddProtectedSpaceModal = () => {
    setShowAddProtectedSpaceModal(currentState => !currentState);
  };

  const handleProtectedSpaceMarkerPress = (space: ProtectedSpace) => {
    setSelectedProtectedSpace(space);
  };

  const handlePresentSelectedProtectedSpaceBottomSheetModal = () => {
    selectedProtectedSpaceBottomSheetModalRef.current?.present();
  };

  const handleDismissSelectedProtectedSpaceBottomSheetModal = () => {
    setSelectedProtectedSpace(null);
  };

  useEffect(() => {
    if (selectedProtectedSpace) {
      handlePresentSelectedProtectedSpaceBottomSheetModal();
    }
  }, [selectedProtectedSpace]);

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
          {location &&
            protectedSpaces.map(space => (
              <Marker
                key={space.id}
                coordinate={{
                  latitude: space.coordinate.latitude,
                  longitude: space.coordinate.longitude,
                }}
                onPress={() => handleProtectedSpaceMarkerPress(space)}
              />
            ))}
        </MapView>

        {location && (
          <FAB
            style={styles.addProtectedSpaceFab}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddProtectedSpaceModal}
          />
        )}

        {showAddProtectedSpaceModal && (
          <AddProtectedSpaceModal
            isVisible={showAddProtectedSpaceModal}
            onDismiss={handleToggleShowAddProtectedSpaceModal}
          />
        )}

        {selectedProtectedSpace && (
          <BottomSheetModal
            ref={selectedProtectedSpaceBottomSheetModalRef}
            index={0}
            snapPoints={['25%', '50%']}
            onDismiss={handleDismissSelectedProtectedSpaceBottomSheetModal}>
            <ProtectedSpaceDetails
              contentContainerStyles={styles.protectedSpaceDetailsContainer}
              protectedSpace={selectedProtectedSpace}
            />
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

  addProtectedSpaceFab: {
    position: 'absolute',
    bottom: 35,
    right: 35,
  },

  protectedSpaceDetailsContainer: {
    padding: 10,
  },
});
