import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  Linking,
} from 'react-native';
import {Divider, IconButton} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

import type {ProtectedSpace} from '../utils/types';
import log from '../utils/log';

type Props = {
  contentContainerStyles?: StyleProp<ViewStyle>;
  protectedSpace: ProtectedSpace;
};

const ProtectedSpaceDetails = ({
  contentContainerStyles,
  protectedSpace: space,
}: Props) => {
  const handleOpenGoogleMapsLink = async () => {
    try {
      await Linking.openURL(space.googleMapsLinkUrl);
    } catch (error) {
      log.error(error);
    }
  };

  return (
    <View style={[contentContainerStyles, styles.container]}>
      {/** address & link */}
      <View style={styles.addressAndLinkContainer}>
        {/** address */}
        <Text style={styles.address} numberOfLines={1}>
          {`${space.address.street} ${space.address.buildingNumber}, ${space.address.city}`}
        </Text>

        {/** link */}
        <IconButton
          mode="contained"
          icon="google-maps"
          size={22}
          onPress={handleOpenGoogleMapsLink}
        />
      </View>

      <Divider style={styles.divider} />

      {/** description */}
      <Text style={styles.description}>{space.description}</Text>

      {/** image */}
      <FastImage
        style={styles.image}
        source={{uri: space.imageUrl, priority: 'high'}}
      />

      <View style={styles.userInfoAndTimestampContainer}>
        <FastImage
          style={styles.userPhoto}
          source={{uri: space.createdBy.photoUrl}}
        />

        <Text style={styles.userNameAndTimestamp}>
          @{space.createdBy.name.split(' ').join('_')} on{' '}
          {space.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default ProtectedSpaceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  addressAndLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },

  description: {
    color: 'black',
    marginBottom: 20,
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 4,
    marginBottom: 20,
  },

  userInfoAndTimestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  userNameAndTimestamp: {
    color: 'gray',
  },

  divider: {
    marginBottom: 20,
  },
});
