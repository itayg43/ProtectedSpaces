import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  Animated,
  Platform,
  FlatList,
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

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CommentListItem from '../components/CommentListItem';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const DOT_SIZE = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE * 2;

const ProtectedSpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const {params} = useRoute<ProtectedSpaceDetailsScreenRouteProp>();

  const {findProtectedSpaceById} = useProtectedSpacesContext();

  const [protectedSpaceDetails, setProtectedSpaceDetails] =
    useState<ProtectedSpace | null>(null);

  useEffect(() => {
    setProtectedSpaceDetails(findProtectedSpaceById(params.id));
  }, [params.id, findProtectedSpaceById]);

  return (
    <>
      {protectedSpaceDetails && (
        <View style={[styles.container, {marginBottom: safeAreaInsets.bottom}]}>
          <ImagesSection protectedSpace={protectedSpaceDetails} />

          <DetailsSection protectedSpace={protectedSpaceDetails} />

          <CommentsSection protectedSpace={protectedSpaceDetails} />
        </View>
      )}
    </>
  );
};

export default ProtectedSpaceDetailsScreen;

type SectionProps = {
  protectedSpace: ProtectedSpace;
};

function ImagesSection({protectedSpace}: SectionProps) {
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.imagesSectionContainer}>
      <Animated.FlatList
        data={protectedSpace.images}
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
        {protectedSpace.images.map((_, index) => (
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

function DetailsSection({protectedSpace}: SectionProps) {
  const handleOpenGoogleMapsLink = async () => {
    try {
      await Linking.openURL(protectedSpace.address.url);
    } catch (error) {
      log.error(error);
    }
  };

  return (
    <View style={styles.detailsSectionContainer}>
      {/** address & link */}
      <View style={styles.addressAndLinkContainer}>
        {/** address */}
        <Text style={styles.address} numberOfLines={1}>
          {`${protectedSpace.address.street} ${protectedSpace.address.number}, ${protectedSpace.address.city}`}
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

      {/** user info & timestamp */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>
          @ {protectedSpace.user.name.split(' ').join('_')}
        </Text>

        <Text style={styles.timestamp}>
          | {protectedSpace.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

function CommentsSection({protectedSpace}: SectionProps) {
  return (
    <View style={styles.commentsSectionContainer}>
      <FlatList
        data={protectedSpace.comments}
        keyExtractor={item => item.id}
        renderItem={({item}) => <CommentListItem comment={item} />}
        ItemSeparatorComponent={ListSpacer}
        ListFooterComponent={ListSpacer}
      />
    </View>
  );
}

function ListSpacer() {
  return <View style={styles.listSpacer} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    marginBottom: 20,
    marginTop: 5,
  },
  listSpacer: {
    marginBottom: 5,
  },

  // SECTIONS

  // IMAGES
  imagesSectionContainer: {},
  image: {
    height: 250,
    width: IMAGE_WIDTH,
  },
  closeButton: {
    left: 5,
    position: 'absolute',
    top: 5,
  },
  dotsContainer: {
    bottom: 10,
    columnGap: DOT_SIZE,
    flexDirection: 'row',
    left: SCREEN_WIDTH / 2,
    position: 'absolute',
  },
  dot: {
    backgroundColor: 'white',
    borderRadius: DOT_SIZE,
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  dotIndicator: {
    borderColor: 'white',
    borderRadius: DOT_INDICATOR_SIZE,
    borderWidth: 1,
    bottom: 6,
    height: DOT_INDICATOR_SIZE,
    left: SCREEN_WIDTH / 2 - DOT_SIZE + 4,
    position: 'absolute',
    width: DOT_INDICATOR_SIZE,
  },

  // DETAILS
  detailsSectionContainer: {
    padding: 10,
  },
  addressAndLinkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: 'black',
  },
  userInfoContainer: {
    alignItems: 'center',
    columnGap: 5,
    flexDirection: 'row',
    marginTop: 10,
  },
  userName: {
    color: 'gray',
  },
  timestamp: {
    color: 'gray',
  },

  // COMMENTS
  commentsSectionContainer: {
    flex: 1,
    padding: 10,
  },
});
