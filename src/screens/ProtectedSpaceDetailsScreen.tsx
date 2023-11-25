import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  Animated,
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
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddCommentForm from '../components/forms/AddCommentForm';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 300;
const DOT_SIZE = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE * 2;

const ProtectedSpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const route = useRoute<ProtectedSpaceDetailsScreenRouteProp>();
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const {findProtectedSpaceById} = useProtectedSpacesContext();

  const [space, setSpace] = useState<ProtectedSpace | null>(null);

  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  const imagesScrollX = useRef(new Animated.Value(0)).current;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenGoogleMapsUrl = async () => {
    if (space) {
      try {
        await Linking.openURL(space.address.url);
      } catch (error) {
        log.error(error);
      }
    }
  };

  const handleToggleShowAddCommentModal = () => {
    setShowAddCommentModal(currentState => !currentState);
  };

  useEffect(() => {
    setSpace(findProtectedSpaceById(route.params.id));
  }, [route.params.id, findProtectedSpaceById]);

  return (
    <>
      {space && (
        <KeyboardAvoidingView>
          <View style={styles.container}>
            {/** IMAGES SECTION */}

            <View style={styles.imagesSectionContainer}>
              <Animated.FlatList
                data={space.images}
                keyExtractor={item => item}
                renderItem={({item: uri}) => (
                  <FastImage
                    style={styles.image}
                    source={{uri, priority: 'high'}}
                  />
                )}
                horizontal
                snapToInterval={IMAGE_WIDTH}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: imagesScrollX}}}],
                  {useNativeDriver: true},
                )}
              />

              <IconButton
                style={[styles.closeButton, {top: safeAreaInsets.top}]}
                mode="contained"
                icon="keyboard-backspace"
                onPress={handleGoBack}
              />

              <View style={styles.dotsContainer}>
                {space.images.map((_, index) => (
                  <View key={index} style={styles.dot} />
                ))}
              </View>

              <Animated.View
                style={[
                  styles.dotIndicator,
                  {
                    transform: [
                      {
                        translateX: Animated.divide(
                          imagesScrollX,
                          IMAGE_WIDTH,
                        ).interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, DOT_INDICATOR_SIZE],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            {/** DETAILS SECTION */}

            <View style={styles.detailsSectionContainer}>
              <View style={styles.addressAndLinkContainer}>
                <Text style={styles.address} numberOfLines={1}>
                  {`${space.address.street} ${space.address.number}, ${space.address.city}`}
                </Text>

                <IconButton
                  mode="contained"
                  icon="google-maps"
                  size={22}
                  onPress={handleOpenGoogleMapsUrl}
                />
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.description}>{space.description}</Text>

              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>
                  @ {space.user.name.split(' ').join('_')}
                </Text>

                <Text style={styles.timestamp}>
                  | {space.createdAt.toDate().toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/** COMMENTS SECTION */}

            <View
              style={[
                styles.commentsSectionContainer,
                {marginBottom: safeAreaInsets.bottom},
              ]}>
              <View style={styles.commentsSectionTitleContainer}>
                <Text style={styles.commentsSectionTitle}>Comments</Text>

                <IconButton
                  mode="contained"
                  icon="plus"
                  onPress={handleToggleShowAddCommentModal}
                />
              </View>

              <FlatList
                data={space.comments}
                keyExtractor={item => item.id}
                renderItem={({item}) => <CommentListItem comment={item} />}
                ListEmptyComponent={CommentsEmptyListPlaceholder}
                scrollEnabled={space.comments.length > 0}
                bounces={false}
                ItemSeparatorComponent={CommentsListSpacer}
                ListFooterComponent={CommentsListSpacer}
              />
            </View>

            {/** MODALS */}

            {showAddCommentModal && (
              <Modal
                isVisible={showAddCommentModal}
                onDismiss={handleToggleShowAddCommentModal}>
                <AddCommentForm
                  contentContainerStyle={styles.addCommentFormContainer}
                  onSuccess={handleToggleShowAddCommentModal}
                />
              </Modal>
            )}
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default ProtectedSpaceDetailsScreen;

function CommentsEmptyListPlaceholder() {
  return (
    <View style={styles.commentsListEmptyPlaceholderContainer}>
      <Text style={styles.commentsListEmptyPlaceholderText}>
        No comments yet...
      </Text>
    </View>
  );
}

function CommentsListSpacer() {
  return <View style={styles.commentsListSpacerContainer} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    marginBottom: 20,
    marginTop: 5,
  },

  // IMAGES SECTION
  imagesSectionContainer: {},
  image: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
  },
  closeButton: {
    left: 10,
    position: 'absolute',
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

  // DETAILS SECTION
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

  // COMMENTS SECTION
  commentsSectionContainer: {
    flex: 1,
    padding: 10,
    rowGap: 10,
  },
  commentsSectionTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentsSectionTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  addCommentFormContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  commentsListEmptyPlaceholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsListEmptyPlaceholderText: {
    color: 'black',
  },
  commentsListSpacerContainer: {
    marginBottom: 5,
  },
});
