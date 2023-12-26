/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useState} from 'react';
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
import type {AddCommentFormData, Comment} from '../utils/types';
import {
  SpaceDetailsScreenNavigationProp,
  SpaceDetailsScreenRouteProp,
} from '../navigators/SpacesStackNavigator';
import KeyboardAvoidingView from '../components/views/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddCommentForm from '../components/forms/AddCommentForm';
import alert from '../utils/alert';
import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import useSpaceComments from '../hooks/useSpaceDetails';
import LoadingView from '../components/views/LoadingView';
import ErrorView from '../components/views/ErrorView';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = 300;

const SpaceDetailsScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const route = useRoute<SpaceDetailsScreenRouteProp>();
  const navigation = useNavigation<SpaceDetailsScreenNavigationProp>();

  const {
    status,
    errorMessage,
    space,
    comments,
    handleGetMoreComments,
    handleAddComment,
  } = useSpaceComments(route.params.id);

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
      alert.error('Open address url error');
    }
  };

  const handleToggleShowAddCommentModal = () => {
    setShowAddCommentModal(currentState => !currentState);
  };

  const handleSubmitComment = async (formData: AddCommentFormData) => {
    try {
      await handleAddComment(formData);
      handleToggleShowAddCommentModal();
    } catch (error: any) {
      alert.error(error?.message);
    }
  };

  if (status === 'loading') {
    return <LoadingView />;
  }

  if (status === 'error') {
    return <ErrorView message={errorMessage} onGoBack={handleGoBack} />;
  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        {renderImagesSection()}
        {renderDetailsSection()}
        {renderCommentsSection()}

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

  function renderImagesSection() {
    if (space) {
      return (
        <View style={styles.imagesSectionContainer}>
          <FlatList
            data={space.images}
            keyExtractor={item => item}
            renderItem={({item, index}) => (
              <ImageListItem
                url={item}
                index={index + 1}
                total={space.images.length}
              />
            )}
            horizontal
            snapToInterval={IMAGE_WIDTH}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            bounces={false}
          />

          <IconButton
            style={[styles.goBackButton, {top: safeAreaInsets?.top}]}
            mode="contained"
            icon="keyboard-backspace"
            onPress={handleGoBack}
          />
        </View>
      );
    }
  }

  function renderDetailsSection() {
    if (space) {
      return (
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

          <Text style={styles.colorBlack}>{space.description}</Text>

          <View style={styles.userAndTimestampContainer}>
            <Text style={styles.colorGray}>
              @{space.user.name.replace(' ', '_')}
            </Text>

            <Text style={styles.colorGray}>|</Text>

            <Text style={styles.colorGray}>
              {space.createdAt.toDate().toLocaleDateString()}
            </Text>
          </View>
        </View>
      );
    }
  }

  function renderCommentsSection() {
    if (space) {
      return (
        <View
          style={[
            styles.commentsSectionContainer,
            {marginBottom: safeAreaInsets?.bottom},
          ]}>
          <View style={styles.commentsSectionTitleContainer}>
            <Text style={styles.commentsSectionTitle}>Comments</Text>

            <IconButton
              mode="contained"
              icon="plus"
              onPress={handleToggleShowAddCommentModal}
            />
          </View>

          <View style={styles.commentListContainer}>
            <FlatList
              data={comments}
              keyExtractor={item => item.id}
              renderItem={({item}) => <CommentListItem item={item} />}
              ListEmptyComponent={CommentListEmptyPlaceholder}
              bounces={false}
              ItemSeparatorComponent={CommentListSpacer}
              ListFooterComponent={CommentListFooter}
              onEndReachedThreshold={0.3}
              onEndReached={({distanceFromEnd}) => {
                if (distanceFromEnd <= 0) {
                  return;
                }
                handleGetMoreComments();
              }}
            />
          </View>
        </View>
      );
    }
  }
};

export default SpaceDetailsScreen;

type ImageListItemProps = {
  url: string;
  index: number;
  total: number;
};

function ImageListItem({url, index, total}: ImageListItemProps) {
  return (
    <View>
      <FastImage style={styles.image} source={{uri: url, priority: 'high'}} />

      <Text style={styles.imageIndexText}>
        {index} / {total}
      </Text>
    </View>
  );
}

type CommentListItemProps = {
  item: Comment;
};

function CommentListItem({item}: CommentListItemProps) {
  return (
    <View style={styles.commentListItemContainer}>
      <View style={styles.commentListItemDetailsContainer}>
        <Text style={styles.colorBlack}>{item.value}</Text>

        <View style={styles.commentListItemUserAndTimestampContainer}>
          <Text style={styles.colorGray}>
            @{item.user.name.replace(' ', '_')}
          </Text>

          <Text style={styles.colorGray}>|</Text>

          <Text style={styles.colorGray}>
            {item.createdAt.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CommentListEmptyPlaceholder() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black'}}>No comments found</Text>
    </View>
  );
}

function CommentListSpacer() {
  return <View style={{marginBottom: 5}} />;
}

function CommentListFooter() {
  return <View style={{marginBottom: 5}} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    marginBottom: 20,
    marginTop: 5,
  },
  colorGray: {
    color: 'gray',
  },
  colorBlack: {
    color: 'black',
  },

  // IMAGES SECTION

  imagesSectionContainer: {},
  image: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
  },
  imageIndexText: {
    alignSelf: 'center',
    bottom: 10,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
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
  userAndTimestampContainer: {
    columnGap: 5,
    flexDirection: 'row',
    marginTop: 10,
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
  commentListContainer: {
    flex: 1,
  },
  commentListItemContainer: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  commentListItemDetailsContainer: {
    rowGap: 5,
  },
  commentListItemUserAndTimestampContainer: {
    columnGap: 5,
    flexDirection: 'row',
  },
  addCommentFormContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
