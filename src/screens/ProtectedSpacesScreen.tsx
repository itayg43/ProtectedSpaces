import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FAB} from 'react-native-paper';

import AddProtectedSpaceModal from '../modals/AddProtectedSpaceModal';
import ProtectedSpacesMap from '../components/ProtectedSpacesMap';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import {useLocationContext} from '../contexts/locationContext';

const ProtectedSpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const location = useLocationContext();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleShowAddModal = () => {
    setShowAddModal(currState => !currState);
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <ProtectedSpacesMap />

        {location && (
          <FAB
            style={[styles.addFab, {bottom: safeAreaInsets.bottom}]}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddModal}
          />
        )}

        {showAddModal && (
          <AddProtectedSpaceModal
            isVisible={showAddModal}
            onDismiss={handleToggleShowAddModal}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProtectedSpacesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addFab: {
    position: 'absolute',
    right: 20,
    borderRadius: 30,
  },
});
