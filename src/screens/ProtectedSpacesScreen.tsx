import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FAB} from 'react-native-paper';

import ProtectedSpacesMap from '../components/ProtectedSpacesMap';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import {useLocationContext} from '../contexts/locationContext';
import Modal from '../components/Modal';
import AddProtectedSpaceForm from '../components/forms/AddProtectedSpaceForm';

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
          <Modal isVisible={showAddModal} onDismiss={handleToggleShowAddModal}>
            <AddProtectedSpaceForm
              contentContainerStyle={styles.addFormContainer}
              onSuccess={handleToggleShowAddModal}
            />
          </Modal>
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

  addFormContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
