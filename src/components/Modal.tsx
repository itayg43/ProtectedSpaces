import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, ViewStyle, View} from 'react-native';
import {Modal as PaperModal, IconButton} from 'react-native-paper';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  isVisible: boolean;
  onDismiss: () => void;
} & PropsWithChildren;

const Modal = ({
  contentContainerStyle,
  isVisible,
  onDismiss,
  children,
}: Props) => {
  return (
    <PaperModal
      style={styles.container}
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

      <View style={contentContainerStyle}>{children}</View>
    </PaperModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  closeIconButton: {
    alignSelf: 'center',
  },
});
