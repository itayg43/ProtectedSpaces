import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';

import useLocation from '../hooks/useLocation';
import {useProtectedSpacesContext} from '../contexts/ProtectedSpacesContext';
import type {ProtectedSpace} from '../utils/types';
import AddProtectedSpaceModal from '../modals/AddProtectedSpaceModal';
import ProtectedSpaceDetailsBottomSheetModal from '../modals/ProtectedSpaceDetailsBottomSheetModal';

const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LONGITUDE_DELTA = 0.01;

const ProtectedSpacesMapScreen = () => {
  const location = useLocation();

  const {protectedSpaces} = useProtectedSpacesContext();
  const [selectedSpace, setSelectedSpace] = useState<ProtectedSpace | null>(
    null,
  );

  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleShowAddModal = () => {
    setShowAddModal(currentState => !currentState);
  };

  const handleMarkerPress = (space: ProtectedSpace) => {
    setSelectedSpace(space);
  };

  const handleDismissDetailsModal = () => {
    setSelectedSpace(null);
  };

  return (
    <>
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
                onPress={() => handleMarkerPress(space)}
              />
            ))}
        </MapView>

        {location && (
          <FAB
            style={styles.fab}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddModal}
          />
        )}
      </View>

      {/** modals */}

      {showAddModal && (
        <AddProtectedSpaceModal
          isVisible={showAddModal}
          onDismiss={handleToggleShowAddModal}
        />
      )}

      {selectedSpace && (
        <ProtectedSpaceDetailsBottomSheetModal
          isVisible
          onDismiss={handleDismissDetailsModal}
          protectedSpace={selectedSpace}
        />
      )}
    </>
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

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
