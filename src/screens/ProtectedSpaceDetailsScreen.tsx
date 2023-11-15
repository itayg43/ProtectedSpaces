import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {Divider, IconButton} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useRoute} from '@react-navigation/native';

import log from '../utils/log';
import type {ProtectedSpace} from '../utils/types';
import {ProtectedSpaceDetailsScreenRouteProp} from '../navigators/ProtectedSpacesStack';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';

const ProtectedSpaceDetailsScreen = () => {
  const route = useRoute<ProtectedSpaceDetailsScreenRouteProp>();

  const {protectedSpaces} = useProtectedSpacesContext();
  const [protectedSpace, setProtectedSpace] = useState<ProtectedSpace | null>(
    null,
  );

  const handleOpenGoogleMapsLink = async () => {
    if (!protectedSpace) {
      return;
    }

    try {
      await Linking.openURL(protectedSpace.googleMapsLinkUrl);
    } catch (error) {
      log.error(error);
    }
  };

  useEffect(() => {
    setProtectedSpace(
      protectedSpaces.find(p => p.id === route.params.id) || null,
    );
  }, [route, protectedSpaces]);

  return (
    <>
      {protectedSpace && (
        <View style={styles.container}>
          {/** address & link */}
          <View style={styles.addressAndLinkContainer}>
            {/** address */}
            <Text style={styles.address} numberOfLines={1}>
              {`${protectedSpace.address.street} ${protectedSpace.address.buildingNumber}, ${protectedSpace.address.city}`}
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
          <Text style={styles.description}>{protectedSpace.description}</Text>

          {/** image */}
          <FastImage
            style={styles.image}
            source={{uri: protectedSpace.imagesUrls[0], priority: 'high'}}
          />

          <View style={styles.userInfoAndTimestampContainer}>
            <FastImage
              style={styles.userPhoto}
              source={{uri: protectedSpace.createdBy.photoUrl}}
            />

            <Text style={styles.userNameAndTimestamp}>
              @{protectedSpace.createdBy.name.split(' ').join('_')} on{' '}
              {protectedSpace.createdAt.toDate().toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default ProtectedSpaceDetailsScreen;

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
