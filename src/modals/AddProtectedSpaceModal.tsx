import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, IconButton} from 'react-native-paper';

import AddProtectedSpaceForm from '../components/AddProtectedSpaceForm';

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

const AddProtectedSpaceModal = ({isVisible, onDismiss}: Props) => {
  return (
    <Modal style={styles.container} visible={isVisible} dismissable={false}>
      <IconButton
        style={styles.closeIconButton}
        mode="contained"
        icon="close"
        iconColor="black"
        size={20}
        onPress={onDismiss}
      />

      <AddProtectedSpaceForm
        contentContainerStyle={styles.formContainer}
        onSuccess={onDismiss}
      />
    </Modal>
  );
};

export default AddProtectedSpaceModal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  closeIconButton: {
    alignSelf: 'center',
  },

  formContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
