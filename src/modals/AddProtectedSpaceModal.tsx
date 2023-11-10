import React from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {Modal, IconButton} from 'react-native-paper';

import AddProtectedSpaceForm from '../components/AddProtectedSpaceForm';
import protectedSpacesService from '../services/protectedSpacesService';
import type {AddProtectedSpaceFormData} from '../utils/types';

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

const AddProtectedSpaceModal = ({isVisible, onDismiss}: Props) => {
  const handleAddProtectedSpace = async (
    formData: AddProtectedSpaceFormData,
  ) => {
    try {
      Keyboard.dismiss();
      await protectedSpacesService.add(formData);
      onDismiss();
    } catch (error) {}
  };

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

      <AddProtectedSpaceForm onSubmit={handleAddProtectedSpace} />
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
});
