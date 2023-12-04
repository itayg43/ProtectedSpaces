import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {UserProtectedSpacesAndCommentsScreenNavigationProp} from '../navigators/DrawerNavigator';
import useUserProtectedSpacesAndComments from '../hooks/useUserProtectedSpacesAndComments';
import {useAuthContext} from '../contexts/authContext';
import LoadingView from '../components/views/LoadingView';
import ErrorView from '../components/views/ErrorView';
import {Comment, ProtectedSpace} from '../utils/types';
import log from '../utils/log';
import protectedSpacesService from '../services/protectedSpacesService';
import commentsService from '../services/commentsService';

const UserProtectedSpacesAndComments = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const navigation =
    useNavigation<UserProtectedSpacesAndCommentsScreenNavigationProp>();

  const {user} = useAuthContext();

  const {status, protectedSpaces, comments} = useUserProtectedSpacesAndComments(
    user?.uid,
  );

  const handleGoBack = () => {
    navigation.goBack();
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

  return (
    <View
      style={[
        styles.container,
        {marginTop: safeAreaInsets.top, marginBottom: safeAreaInsets.bottom},
      ]}>
      <IconButton
        style={styles.goBackButton}
        mode="contained"
        icon="keyboard-backspace"
        onPress={handleGoBack}
      />

      <View style={styles.listsContainer}>
        <ProtectedSpacesSection protectedSpaces={protectedSpaces} />

        <CommentsSection comments={comments} />
      </View>
    </View>
  );
};

export default UserProtectedSpacesAndComments;

type ProtectedSpacesSectionProps = {
  protectedSpaces: ProtectedSpace[];
};

function ProtectedSpacesSection({
  protectedSpaces,
}: ProtectedSpacesSectionProps) {
  const handleDelete = async (id: string) => {
    try {
      await protectedSpacesService.deleteById(id);
      await commentsService.deleteByProtectedSpaceId(id);
    } catch (error) {
      log.error(error);
    }
  };

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listLabel}>Protected Spaces</Text>

      <FlatList
        data={protectedSpaces}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.listItemContainer}>
            <View style={styles.listItemDetailsContainer}>
              <Text>
                {item.address.street} {item.address.number}
              </Text>

              <Text style={styles.timestamp}>
                {item.createdAt.toDate().toLocaleDateString()}
              </Text>
            </View>

            <IconButton
              mode="contained"
              icon="trash-can"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
        bounces={false}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={ListFooter}
      />
    </View>
  );
}

type CommentsSectionProps = {
  comments: Comment[];
};

function CommentsSection({comments}: CommentsSectionProps) {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.listLabel}>Comments</Text>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.listItemContainer}>
            <View style={styles.listItemDetailsContainer}>
              <Text>{item.value}</Text>

              <Text style={styles.timestamp}>
                {item.createdAt.toDate().toLocaleDateString()}
              </Text>
            </View>

            <IconButton mode="contained" icon="trash-can" />
          </View>
        )}
        bounces={false}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={ListFooter}
      />
    </View>
  );
}

function ListItemSeparator() {
  // eslint-disable-next-line react-native/no-inline-styles
  return <View style={{marginBottom: 5}} />;
}

function ListFooter() {
  // eslint-disable-next-line react-native/no-inline-styles
  return <View style={{marginBottom: 5}} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  goBackButton: {
    marginLeft: 20,
  },

  listsContainer: {
    flex: 1,
    padding: 20,
    rowGap: 10,
  },
  listContainer: {
    flex: 1,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItemContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemDetailsContainer: {
    rowGap: 5,
  },
  timestamp: {
    color: 'gray',
  },
});
