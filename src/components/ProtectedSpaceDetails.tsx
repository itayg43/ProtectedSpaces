import React from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle} from 'react-native';
import {Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

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
      <View style={styles.detailsContainer}>
        <Text style={styles.address}>{protectedSpace.address}</Text>

        <Text style={styles.description}>{protectedSpace.description}</Text>
      </View>

      <Divider />

      <FastImage
        style={styles.image}
        source={{uri: protectedSpace.imageUrl, priority: 'high'}}
      />
    </View>
  );
};

export default ProtectedSpaceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 10,
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 4,
  },

  detailsContainer: {
    rowGap: 5,
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
