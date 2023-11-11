import React from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle} from 'react-native';

import type {ProtectedSpace} from '../utils/types';

type Props = {
  contentContainerStyles?: StyleProp<ViewStyle>;
  protectedSpace: ProtectedSpace;
};

const ProtectedSpaceDetails = ({
  contentContainerStyles,
  protectedSpace,
}: Props) => {
  return (
    <View style={[contentContainerStyles, styles.container]}>
      <Text style={styles.address}>{protectedSpace.address}</Text>

      <Text style={styles.description}>{protectedSpace.description}</Text>
    </View>
  );
};

export default ProtectedSpaceDetails;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },

  address: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },

  description: {
    color: 'black',
  },
});
