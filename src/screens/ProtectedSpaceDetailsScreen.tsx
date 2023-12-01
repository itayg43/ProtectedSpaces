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
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import log from '../utils/log';
import type {AddCommentFormData, Comment, ProtectedSpace} from '../utils/types';
import {
  ProtectedSpaceDetailsScreenNavigationProp,
  ProtectedSpaceDetailsScreenRouteProp,
} from '../navigators/ProtectedSpacesStackNavigator';
import CommentListItem from '../components/CommentListItem';
import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddCommentForm from '../components/forms/AddCommentForm';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';
import protectedSpacesService from '../services/protectedSpacesService';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 300;
const DOT_SIZE = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE * 2;

const ProtectedSpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const route = useRoute<ProtectedSpaceDetailsScreenRouteProp>();
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const {user} = useAuthContext();

  const [protectedSpace, setProtectedSpace] = useState<ProtectedSpace | null>(
    null,
  );
  const [comments, setComments] = useState<Comment[]>([]);

  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  const imagesScrollX = useRef(new Animated.Value(0)).current;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenGoogleMapsUrl = async () => {
    if (protectedSpace) {
      try {
        await Linking.openURL(protectedSpace.address.url);
      } catch (error) {
        log.error(error);
      }
    }
  };

  const handleToggleShowAddCommentModal = () => {
    setShowAddCommentModal(currentState => !currentState);
  };

  const handleSubmitComment = async (formData: AddCommentFormData) => {
    if (protectedSpace) {
      try {
        await commentsService.addComment(user!, formData, protectedSpace.id);
        handleToggleShowAddCommentModal();
      } catch (error) {
        log.error(error);
      }
    }
  };

  useEffect(() => {
    if (!protectedSpace) {
      return;
    }

    const unsubscribe =
      commentsService.subCollectionSubscriptionByProtectedSpaceId(
        protectedSpace.id,
        c => setComments(c),
        error => log.error(error),
      );

    return unsubscribe;
  }, [protectedSpace]);

  useEffect(() => {
    (async () => {
      try {
        setProtectedSpace(
          await protectedSpacesService.findProtectedSpaceById(route.params.id),
        );
      } catch (error) {
        log.error(error);
      }
    })();
  }, [route.params.id]);

  return (
    <>
      {protectedSpace && (
        <KeyboardAvoidingView>
          <View style={styles.container}>
            {/** IMAGES SECTION */}

            <View style={styles.imagesSectionContainer}>
              <Animated.FlatList
                data={protectedSpace.images}
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
                {protectedSpace.images.map((_, index) => (
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
                  {`${protectedSpace.address.street} ${protectedSpace.address.number}, ${protectedSpace.address.city}`}
                </Text>

                <IconButton
                  mode="contained"
                  icon="google-maps"
                  size={22}
                  onPress={handleOpenGoogleMapsUrl}
                />
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.description}>
                {protectedSpace.description}
              </Text>

              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>
                  @ {protectedSpace.user.name.split(' ').join('_')}
                </Text>

                <Text style={styles.timestamp}>
                  | {protectedSpace.createdAt.toDate().toLocaleDateString()}
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
                data={comments}
                keyExtractor={item => item.id}
                renderItem={({item}) => <CommentListItem comment={item} />}
                ListEmptyComponent={CommentsEmptyListPlaceholder}
                scrollEnabled={comments.length > 0}
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
                  onSubmit={handleSubmitComment}
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
