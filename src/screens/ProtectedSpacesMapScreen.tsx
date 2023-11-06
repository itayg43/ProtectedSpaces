import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Modal} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import useLocation from '../hooks/useLocation';
import {useProtectedSpacesContext} from '../contexts/ProtectedSpacesContext';
import type {ProtectedSpace} from '../utils/types';
import ProtectedSpaceDetails from '../components/ProtectedSpaceDetails';

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
          {protectedSpaces.map(space => (
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
          <TouchableOpacity
            style={styles.addProtectedSpaceButtonContainer}
            onPress={handleToggleShowAddProtectedSpaceModal}>
            <View style={styles.addProtectedSpaceButton}>
              <Text style={styles.addProtectedSpaceButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        )}

        {showAddProtectedSpaceModal && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAddProtectedSpaceModal}>
            <View style={styles.addProtectedSpaceModalContainer}>
              <View style={styles.addProtectedSpaceModalContentContainer}>
                <Text>Modal</Text>
              </View>
            </View>
          </Modal>
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

  addProtectedSpaceButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addProtectedSpaceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addProtectedSpaceButtonText: {
    fontSize: 20,
  },

  addProtectedSpaceModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProtectedSpaceModalContentContainer: {
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  protectedSpaceDetailsContainer: {
    padding: 10,
  },
});
