import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, IconButton} from 'react-native-paper';

import AddProtectedSpaceForm, {
  AddProtectedSpaceFormData,
} from '../components/AddProtectedSpaceForm';
import protectedSpacesService from '../services/protectedSpacesService';

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

const AddProtectedSpaceModal = ({isVisible, onDismiss}: Props) => {
  const handleAddProtectedSpace = async (
    formData: AddProtectedSpaceFormData,
  ) => {
    try {
      await protectedSpacesService.add(formData);
      onDismiss();
    } catch (error) {}
  };

  return (
    <Modal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      visible={isVisible}
      dismissable={false}>
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
  contentContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  closeIconButton: {
    alignSelf: 'flex-end',
  },
});
