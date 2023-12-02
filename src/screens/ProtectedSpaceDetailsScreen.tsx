import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  FlatList,
} from 'react-native';
import {IconButton, Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';

import log from '../utils/log';
import type {AddCommentFormData} from '../utils/types';
import {
  ProtectedSpaceDetailsScreenNavigationProp,
  ProtectedSpaceDetailsScreenRouteProp,
} from '../navigators/ProtectedSpacesStackNavigator';
import CommentListItem from '../components/CommentListItem';
import KeyboardAvoidingView from '../components/views/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddCommentForm from '../components/forms/AddCommentForm';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';
import LoadingView from '../components/views/LoadingView';
import errorAlert from '../utils/errorAlert';
import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import useProtectedSpace from '../hooks/useProtectedSpace';
import ErrorView from '../components/views/ErrorView';
import useCommentsCollection from '../hooks/useCommentsCollection';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 300;

const ProtectedSpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const route = useRoute<ProtectedSpaceDetailsScreenRouteProp>();
  const navigation = useNavigation<ProtectedSpaceDetailsScreenNavigationProp>();

  const {user} = useAuthContext();

  const {status, protectedSpace} = useProtectedSpace(route.params.id);
  const comments = useCommentsCollection(protectedSpace?.id);

  const [showAddCommentModal, setShowAddCommentModal] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenAddressUrl = async () => {
    if (!protectedSpace) {
      return;
    }

    try {
      await Linking.openURL(protectedSpace.address.url);
    } catch (error) {
      log.error(error);
      errorAlert.show('Open address url error');
    }
  };

  const handleToggleShowAddCommentModal = () => {
    setShowAddCommentModal(currentState => !currentState);
  };

  const handleSubmitComment = async (formData: AddCommentFormData) => {
    if (!user || !protectedSpace) {
      return;
    }

    try {
      await commentsService.add(user, formData, protectedSpace.id);
      handleToggleShowAddCommentModal();
    } catch (error: any) {
      errorAlert.show(error.message);
    }
  };

  if (status === 'loading') {
    return <LoadingView />;
  }

  if (status === 'error') {
    return (
      <ErrorView
        message="Something went wrong"
        buttonLabel="Go back"
        onPress={handleGoBack}
      />
    );
  }

  if (status === 'idle' && protectedSpace) {
    return (
      <KeyboardAvoidingView>
        <View style={styles.container}>
          {/** IMAGES SECTION */}

          <View style={styles.imagesSectionContainer}>
            <FlatList
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
                {`${protectedSpace.address.street} ${protectedSpace.address.number}, ${protectedSpace.address.city}`}
              </Text>

              <IconButton
                mode="contained"
                icon="google-maps"
                size={22}
                onPress={handleOpenAddressUrl}
              />
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.description}>{protectedSpace.description}</Text>

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
    );
  }
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
