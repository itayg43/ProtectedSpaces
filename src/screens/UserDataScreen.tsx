import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {UserDataScreenNavigationProp} from '../navigators/UserDataStackNavigator';
import useUserData from '../hooks/useUserData';
import LoadingView from '../components/views/LoadingView';
import ErrorView from '../components/views/ErrorView';
import {Comment, ProtectedSpace} from '../utils/types';
import log from '../utils/log';
import protectedSpacesService from '../services/protectedSpacesService';
import alert from '../utils/alert';

const UserDataScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const navigation = useNavigation<UserDataScreenNavigationProp>();

  const {initialRequestStatus, protectedSpaces, comments} = useUserData();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDelete = (id: string) => {
    alert.remove(async () => {
      try {
        await protectedSpacesService.deleteByIdIncludeComments(id);
      } catch (error: any) {
        log.error(error);
        alert.error(error.message);
      }
    });
  };

  if (initialRequestStatus === 'loading') {
    return <LoadingView />;
  }

  if (initialRequestStatus === 'error') {
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
        <Text style={styles.listLabel}>Protected Spaces</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={protectedSpaces}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ProtectedSpaceListItem
              item={item}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          bounces={false}
          ItemSeparatorComponent={ListItemSeparator}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
        />

        <Text style={styles.listLabel}>Comments</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({item}) => <CommentListItem item={item} />}
          bounces={false}
          ItemSeparatorComponent={ListItemSeparator}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
        />
      </View>
    </View>
  );
};

export default UserDataScreen;

type ProtectedSpaceListItemProps = {
  item: ProtectedSpace;
  onDelete: () => void;
};

function ProtectedSpaceListItem({item, onDelete}: ProtectedSpaceListItemProps) {
  return (
    <View style={styles.listItemContainer}>
      <View style={styles.listItemDetailsContainer}>
        <Text>
          {item.address.street} {item.address.number}
        </Text>

        <Text style={styles.timestamp}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>

      <IconButton mode="contained" icon="trash-can" onPress={onDelete} />
    </View>
  );
}

type CommentListItemProps = {
  item: Comment;
};

function CommentListItem({item}: CommentListItemProps) {
  return (
    <View style={styles.listItemContainer}>
      <View style={styles.listItemDetailsContainer}>
        <Text>{item.value}</Text>

        <Text style={styles.timestamp}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>

      <IconButton mode="contained" icon="trash-can" />
    </View>
  );
}

type ListEmptyProps = {
  message: string;
};

function ListEmpty({message = 'No data found'}: ListEmptyProps) {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text>{message}</Text>
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
  },
  listItemContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  listItemDetailsContainer: {
    rowGap: 5,
  },
  timestamp: {
    color: 'gray',
  },
});
