import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import ProtectedSpaceDetails from '../components/ProtectedSpaceDetails';
import type {ProtectedSpace} from '../utils/types';

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
  protectedSpace: ProtectedSpace;
};

const ProtectedSpaceDetailsBottomSheetModal = ({
  isVisible,
  onDismiss,
  protectedSpace,
}: Props) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    }
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['25%', '75%']}
      onDismiss={onDismiss}>
      <ProtectedSpaceDetails
        contentContainerStyles={styles.detailsContainer}
        protectedSpace={protectedSpace}
      />
    </BottomSheetModal>
  );
};

export default ProtectedSpaceDetailsBottomSheetModal;

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 10,
  },
});
