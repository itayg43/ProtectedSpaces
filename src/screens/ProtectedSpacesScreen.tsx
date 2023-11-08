import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';

import useLocation from '../hooks/useLocation';
import type {ProtectedSpace} from '../utils/types';
import AddProtectedSpaceModal from '../modals/AddProtectedSpaceModal';
import ProtectedSpaceDetailsBottomSheetModal from '../modals/ProtectedSpaceDetailsBottomSheetModal';
import ProtectedSpacesMap from '../components/ProtectedSpacesMap';

const ProtectedSpacesScreen = () => {
  const location = useLocation();

  const [space, setSpace] = useState<ProtectedSpace | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleShowAddModal = () => {
    setShowAddModal(currState => !currState);
  };

  const handleMarkerPress = (selectedSpace: ProtectedSpace) => {
    setSpace(selectedSpace);
  };

  const handleDismissDetailsModal = () => {
    setSpace(null);
  };

  return (
    <>
      <View style={styles.container}>
        <ProtectedSpacesMap
          location={location}
          onMarkerPress={handleMarkerPress}
        />

        {location && (
          <FAB
            style={styles.fab}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddModal}
          />
        )}
      </View>

      {/** Modals */}

      {showAddModal && (
        <AddProtectedSpaceModal
          isVisible={showAddModal}
          onDismiss={handleToggleShowAddModal}
        />
      )}

      {space && (
        <ProtectedSpaceDetailsBottomSheetModal
          isVisible
          onDismiss={handleDismissDetailsModal}
          protectedSpace={space}
        />
      )}
    </>
  );
};

export default ProtectedSpacesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
