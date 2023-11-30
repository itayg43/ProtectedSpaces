import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {UserPlacesAndCommentsScreenNavigationProp} from '../navigators/DrawerNavigator';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import type {Comment, ProtectedSpace} from '../utils/types';

type UserPlacesAndComments = {
  places: ProtectedSpace[];
  comments: Comment[];
};

const UserPlacesAndCommentsScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const topInset = safeAreaInsets.top > 20 ? safeAreaInsets.top : 30;
  const bottomInset = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20;

  const navigation = useNavigation<UserPlacesAndCommentsScreenNavigationProp>();

  const {findCurrentUserProtectedSpaces, findCurrentUserComments} =
    useProtectedSpacesContext();

  const [placesAndCommnets, setPlacesAndCommnets] =
    useState<UserPlacesAndComments>({
      places: [],
      comments: [],
    });

  const handleGoBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setPlacesAndCommnets({
      places: findCurrentUserProtectedSpaces(),
      comments: findCurrentUserComments(),
    });
  }, [findCurrentUserProtectedSpaces, findCurrentUserComments]);

  return (
    <View
      style={[
        styles.container,
        {marginTop: topInset, marginBottom: bottomInset},
      ]}>
      <View style={styles.goBackButtonContainer}>
        <IconButton
          style={styles.goBackButton}
          mode="contained"
          icon="keyboard-backspace"
          onPress={handleGoBackPress}
        />
      </View>

      <View style={styles.listsContainer}>
        {/** PLACES */}
        <View style={styles.listContainer}>
          <View style={styles.listItemHeaderContainer}>
            <Text style={styles.listItemHeaderTitle}>Places</Text>
          </View>

          <FlatList
            data={placesAndCommnets.places}
            keyExtractor={item => item.id}
            renderItem={({item}) => <PlaceListItem item={item} />}
            bounces={false}
            ItemSeparatorComponent={ListItemSeparator}
            ListFooterComponent={ListFooter}
          />
        </View>

        {/** COMMENTS */}
        <View style={styles.listContainer}>
          <View style={styles.listItemHeaderContainer}>
            <Text style={styles.listItemHeaderTitle}>Comments</Text>
          </View>

          <FlatList
            data={placesAndCommnets.comments}
            keyExtractor={item => item.id}
            renderItem={({item}) => <CommentListItem item={item} />}
            bounces={false}
            ItemSeparatorComponent={ListItemSeparator}
            ListFooterComponent={ListFooter}
          />
        </View>
      </View>
    </View>
  );
};

export default UserPlacesAndCommentsScreen;

type PlaceListItemProps = {
  item: ProtectedSpace;
};

function PlaceListItem({item}: PlaceListItemProps) {
  return (
    <View style={styles.listItemContainer}>
      <Text>
        {item.address.street} {item.address.number}
      </Text>
    </View>
  );
}

type CommentListItemProps = {
  item: Comment;
};

function CommentListItem({item}: CommentListItemProps) {
  return (
    <View style={styles.listItemContainer}>
      <Text>{item.value}</Text>
    </View>
  );
}

function ListItemSeparator() {
  return <View style={styles.listItemSeparatorContainer} />;
}

function ListFooter() {
  return <View style={styles.listFooterContainer} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  goBackButtonContainer: {
    flexDirection: 'row',
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
  listItemSeparatorContainer: {
    marginBottom: 5,
  },
  listFooterContainer: {
    marginBottom: 5,
  },

  listItemContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  listItemHeaderContainer: {
    marginBottom: 10,
  },
  listItemHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
