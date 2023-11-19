import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import {IconButton, Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';

import log from '../utils/log';
import type {ProtectedSpace} from '../utils/types';
import {
  ProtectedSpaceDetailsScreenNavigationProp,
  ProtectedSpaceDetailsScreenRouteProp,
} from '../navigators/ProtectedSpacesStack';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';

const {width} = Dimensions.get('screen');

const IMAGE_WIDTH = width;
const DOT_SIZE = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE * 2;

const ProtectedSpaceDetailsScreen = () => {
  const {params} = useRoute<ProtectedSpaceDetailsScreenRouteProp>();

  const {getProtectedSpaceById} = useProtectedSpacesContext();

  const [protectedSpaceDetails, setProtectedSpaceDetails] =
    useState<ProtectedSpace | null>(null);

  useEffect(() => {
    setProtectedSpaceDetails(getProtectedSpaceById(params.id));
  }, [params.id, getProtectedSpaceById]);

  return (
    <>
      {protectedSpaceDetails && (
        <View style={styles.container}>
          <ImagesSection images={protectedSpaceDetails.images} />

          <DetailsSection details={protectedSpaceDetails} />
        </View>
      )}
    </>
  );
};

export default ProtectedSpaceDetailsScreen;

type ImagesSectionProps = {
  images: string[];
};

function ImagesSection({images}: ImagesSectionProps) {
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Animated.FlatList
        data={images}
        keyExtractor={item => item}
        renderItem={({item: uri}) => (
          <FastImage style={styles.image} source={{uri, priority: 'high'}} />
        )}
        horizontal
        snapToInterval={IMAGE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
      />

      {/** close button */}
      <IconButton
        style={styles.closeButton}
        mode="contained"
        icon={Platform.OS === 'ios' ? 'close' : 'keyboard-backspace'}
        size={20}
        containerColor="white"
        onPress={handleClose}
      />

      {/** dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>

      {/** dot indicator */}
      <Animated.View
        style={[
          styles.dotIndicator,
          {
            transform: [
              {
                translateX: Animated.divide(scrollX, IMAGE_WIDTH).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, DOT_INDICATOR_SIZE],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

type DetailsSectionProps = {
  details: ProtectedSpace;
};

function DetailsSection({details}: DetailsSectionProps) {
  const handleOpenGoogleMapsLink = async () => {
    if (details) {
      try {
        await Linking.openURL(details.address.url);
      } catch (error) {
        log.error(error);
      }
    }
  };

  return (
    <View style={styles.detailsContainer}>
      {/** address & link */}
      <View style={styles.addressAndLinkContainer}>
        {/** address */}
        <Text style={styles.address} numberOfLines={1}>
          {`${details.address.street} ${details.address.number}, ${details.address.city}`}
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
      <Text style={styles.description}>{details.description}</Text>

      {/** user info & timestamp */}
      <View style={styles.userInfoContainer}>
        <FastImage
          style={styles.userPhoto}
          source={{uri: details.user.photo}}
        />

        <Text style={styles.userName}>
          {details.user.name.split(' ').join('_')}
        </Text>

        <Text style={styles.timestamp}>
          on {details.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: IMAGE_WIDTH,
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: width / 2,
    columnGap: DOT_SIZE,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: 'white',
  },
  dotIndicator: {
    width: DOT_INDICATOR_SIZE,
    height: DOT_INDICATOR_SIZE,
    borderRadius: DOT_INDICATOR_SIZE,
    borderWidth: 1,
    borderColor: 'white',
    position: 'absolute',
    bottom: 6,
    left: width / 2 - DOT_SIZE + 4,
  },

  detailsContainer: {
    padding: 10,
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
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    columnGap: 5,
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userName: {
    color: 'gray',
  },
  timestamp: {
    color: 'gray',
  },

  divider: {
    marginTop: 5,
    marginBottom: 20,
  },
});
