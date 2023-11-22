import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {IconButton, Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import log from '../utils/log';
import type {AddCommentFormData, ProtectedSpace} from '../utils/types';
import {
  ProtectedSpaceDetailsScreenNavigationProp,
  ProtectedSpaceDetailsScreenRouteProp,
} from '../navigators/ProtectedSpacesStack';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import AddCommentForm from '../components/AddCommentForm';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
        <KeyboardAwareScrollView>
          <View
            style={[styles.container, {marginBottom: safeAreaInsets.bottom}]}>
            <ImagesSection protectedSpace={protectedSpaceDetails} />

            <DetailsSection protectedSpace={protectedSpaceDetails} />

            <CommentsSection protectedSpace={protectedSpaceDetails} />
          </View>
        </KeyboardAwareScrollView>
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
  const {handleAddComment} = useProtectedSpacesContext();

  const handleSubmit = async (formData: AddCommentFormData) => {
    try {
      await handleAddComment(formData, protectedSpace);
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  return (
    <View style={styles.commentsSectionContainer}>
      <ScrollView
        contentContainerStyle={styles.commentsContainer}
        horizontal
        scrollEnabled={false}>
        <FlatList
          data={protectedSpace.comments}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.commentListItemContainer}>
              <Text style={styles.comment}>{item.value}</Text>

              <Text style={styles.commentUserAndTimestamp}>
                @ {item.user.name.split(' ').join('_')} |{' '}
                {item.createdAt.toDate().toLocaleDateString()}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={ListSpacer}
          ListFooterComponent={ListSpacer}
        />
      </ScrollView>

      <AddCommentForm onSubmit={handleSubmit} />
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
    marginTop: 5,
    marginBottom: 20,
  },
  listSpacer: {
    marginBottom: 5,
  },

  // SECTIONS

  // IMAGES
  imagesSectionContainer: {},
  image: {
    width: IMAGE_WIDTH,
    height: 250,
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
    left: SCREEN_WIDTH / 2,
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
    left: SCREEN_WIDTH / 2 - DOT_SIZE + 4,
  },

  // DETAILS
  detailsSectionContainer: {
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
    marginTop: 10,
    columnGap: 5,
  },
  userName: {
    color: 'gray',
  },
  timestamp: {
    color: 'gray',
  },

  // COMMENTS
  commentsSectionContainer: {
    padding: 10,
    rowGap: 10,
  },
  commentsContainer: {
    flex: 1,
  },
  commentListItemContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    rowGap: 5,
  },
  comment: {
    color: 'black',
  },
  commentUserAndTimestamp: {
    color: 'gray',
  },
});
