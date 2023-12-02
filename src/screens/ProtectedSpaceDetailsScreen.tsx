import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  Animated,
  FlatList,
  Alert,
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
import LoadingView from '../components/LoadingView';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 300;

const ProtectedSpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const route = useRoute<ProtectedSpaceDetailsScreenRouteProp>();
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const {user} = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [space, setSpace] = useState<ProtectedSpace | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenAddressUrl = async () => {
    if (!space) {
      return;
    }

    try {
      await Linking.openURL(space.address.url);
    } catch (error) {
      log.error(error);
      Alert.alert('Error', 'Open address url error');
    }
  };

  const handleToggleShowAddCommentModal = () => {
    setShowAddCommentModal(currentState => !currentState);
  };

  const handleSubmitComment = async (formData: AddCommentFormData) => {
    if (!user || !space) {
      return;
    }

    try {
      await commentsService.add(user, formData, space.id);
      handleToggleShowAddCommentModal();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    if (!space) {
      return;
    }

    const unsubscribe = commentsService.collectionSubscription(
      space.id,
      c => setComments(c),
      error => log.error(error),
    );

    return unsubscribe;
  }, [space]);

  useEffect(() => {
    (async () => {
      try {
        setSpace(await protectedSpacesService.findById(route.params.id));
      } catch (error: any) {
        Alert.alert('Error', error.message, [
          {
            text: 'OK',
            onPress: handleGoBack,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [route.params.id, handleGoBack]);

  if (isLoading) {
    return <LoadingView />;
  }

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
              />

              <IconButton
                style={[styles.goBackButton, {top: safeAreaInsets.top}]}
                mode="contained"
                icon="keyboard-backspace"
                onPress={handleGoBack}
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
                  onPress={handleOpenAddressUrl}
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

            <Modal
              isVisible={showAddCommentModal}
              onDismiss={handleToggleShowAddCommentModal}>
              <AddCommentForm
                contentContainerStyle={styles.addCommentFormContainer}
                onSubmit={handleSubmitComment}
              />
            </Modal>
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
  goBackButton: {
    left: 10,
    position: 'absolute',
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
