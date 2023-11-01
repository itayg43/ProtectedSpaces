import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';

import {ProtectedSpace} from '../utils/types';

type Props = {
  contentContainerStyle: StyleProp<ViewStyle>;
  protectedSpace: ProtectedSpace;
  onClose: () => void;
};

const ProtectedSpaceCard = ({
  contentContainerStyle,
  protectedSpace,
  onClose,
}: Props) => {
  return (
    <View style={[contentContainerStyle, styles.container]}>
      {/** close button */}
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>

      {/** image */}
      <Image style={styles.image} source={{uri: protectedSpace.imageUrl}} />

      {/** details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.address}>{protectedSpace.address}</Text>

        <Text numberOfLines={2}>{protectedSpace.description}</Text>
      </View>
    </View>
  );
};

export default ProtectedSpaceCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 100,
  },

  closeButtonContainer: {
    position: 'absolute',
    top: -15,
    right: 10,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },

  image: {
    width: 80,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  detailsContainer: {
    flex: 1,
    padding: 10,
    rowGap: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
