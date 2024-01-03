/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Space} from '../utils/types';
import LoadingView from '../components/views/LoadingView';
import ErrorView from '../components/views/ErrorView';
import {UserDataScreenNavigationProps} from '../navigators/DrawerNavigator';
import {useProfileContext} from '../contexts/profileContext';

const UserDataScreen = () => {
  const navigation = useNavigation<UserDataScreenNavigationProps>();

  const safeAreaInsetsContext = useSafeAreaInsetsContext();
  const {getSpacesStatus, errorMessage, spaces, handleGetSpaces} =
    useProfileContext();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if (spaces === null) {
      handleGetSpaces();
    }
  }, [spaces, handleGetSpaces]);

  if (getSpacesStatus === 'loading') {
    return <LoadingView />;
  }

  if (getSpacesStatus === 'error') {
    return <ErrorView message={errorMessage} onGoBack={handleGoBack} />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: safeAreaInsetsContext.top,
          marginBottom: safeAreaInsetsContext.bottom,
        },
      ]}>
      <IconButton
        style={styles.goBackButton}
        mode="contained"
        icon="keyboard-backspace"
        onPress={handleGoBack}
      />

      <View style={styles.listsContainer}>
        <View style={styles.listContainer}>
          <Text style={styles.listLabel}>Spaces</Text>

          <FlatList
            data={spaces}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <SpaceListItem item={item} onDelete={() => null} />
            )}
            bounces={false}
            ItemSeparatorComponent={ListItemSeparator}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={ListEmptyPlaceholder}
          />
        </View>

        {/* <View style={styles.listContainer}>
          <Text style={styles.listLabel}>Comments</Text>

          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <CommentListItem
                item={item}
                onDelete={() => handleDeleteComment(item.spaceId, item.id)}
              />
            )}
            bounces={false}
            ItemSeparatorComponent={ListItemSeparator}
            ListFooterComponent={ListFooter}
            ListEmptyComponent={ListEmptyPlaceholder}
            onEndReachedThreshold={0.3}
            onEndReached={handleGetMoreComments}
          />
        </View> */}
      </View>
    </View>
  );
};

export default UserDataScreen;

type SpaceListItemProps = {
  item: Space;
  onDelete: () => void;
};

function SpaceListItem({item, onDelete}: SpaceListItemProps) {
  return (
    <View style={styles.listItemContainer}>
      <View style={styles.listItemDetailsContainer}>
        <Text style={styles.colorBlack}>
          {item.address.street} {item.address.number}
        </Text>

        <Text style={styles.colorGray}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>

      <IconButton mode="contained" icon="trash-can" onPress={onDelete} />
    </View>
  );
}

// type CommentListItemProps = {
//   item: Comment;
//   onDelete: () => void;
// };

// function CommentListItem({item, onDelete}: CommentListItemProps) {
//   return (
//     <View style={styles.listItemContainer}>
//       <View style={styles.listItemDetailsContainer}>
//         <Text style={styles.colorBlack}>{item.value}</Text>

//         <Text style={styles.colorGray}>
//           {item.createdAt.toDate().toLocaleDateString()}
//         </Text>
//       </View>

//       <IconButton mode="contained" icon="trash-can" onPress={onDelete} />
//     </View>
//   );
// }

function ListEmptyPlaceholder() {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text style={styles.colorBlack}>No data found</Text>
    </View>
  );
}

function ListItemSeparator() {
  return <View style={{marginBottom: 5}} />;
}

function ListFooter() {
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
    rowGap: 10,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
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

  colorBlack: {
    color: 'black',
  },
  colorGray: {
    color: 'gray',
  },
});
