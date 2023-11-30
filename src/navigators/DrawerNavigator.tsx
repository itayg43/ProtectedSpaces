import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Divider} from 'react-native-paper';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import ProtectedSpacesStackNavigator from './ProtectedSpacesStackNavigator';
import {useAuthContext} from '../contexts/authContext';
import UserPlacesAndCommentsScreen from '../screens/UserPlacesAndCommentsScreen';

type DrawerParams = {
  protectedSpacesStack: undefined;
  userPlacesAndComments: undefined;
};

export type ProtectedSpacesStackNavigationProp = DrawerNavigationProp<
  DrawerParams,
  'protectedSpacesStack'
>;

export type UserPlacesAndCommentsScreenNavigationProp = DrawerNavigationProp<
  DrawerParams,
  'userPlacesAndComments'
>;

const Drawer = createDrawerNavigator<DrawerParams>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="protectedSpacesStack"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={DrawerContent}>
      <Drawer.Screen
        name="protectedSpacesStack"
        component={ProtectedSpacesStackNavigator}
      />

      <Drawer.Screen
        name="userPlacesAndComments"
        component={UserPlacesAndCommentsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

function DrawerContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const topInset = safeAreaInsets.top > 20 ? safeAreaInsets.top : 30;
  const bottomInset = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20;

  const navigation = useNavigation<UserPlacesAndCommentsScreenNavigationProp>();

  const {user, handleSignOut} = useAuthContext();

  const handleMyPlacesAndCommentsPress = () => {
    navigation.navigate('userPlacesAndComments');
  };

  return (
    <View
      style={[
        styles.container,
        {marginTop: topInset, marginBottom: bottomInset},
      ]}>
      <DrawerListItem label={user?.displayName ?? ''} icon="face-man-profile" />
      <Divider />

      <DrawerListItem
        label="My Places & Comments"
        icon="home"
        onPress={handleMyPlacesAndCommentsPress}
      />
      <Divider />

      <DrawerListItem label="Sign out" icon="logout" onPress={handleSignOut} />
      <Divider />

      <Text style={[styles.versionText, {bottom: bottomInset}]}>
        Version: 0.0.1
      </Text>
    </View>
  );
}

type DrawerListItemProps = {
  label: string;
  icon: string;
  onPress?: () => void;
};

function DrawerListItem({label, icon, onPress}: DrawerListItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItemContainer}>
        <MaterialCommunityIcons name={icon} size={22} color="black" />

        <Text style={styles.listItemLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  listItemContainer: {
    alignItems: 'center',
    columnGap: 10,
    flexDirection: 'row',
    padding: 15,
  },
  listItemLabel: {
    color: 'black',
  },

  versionText: {
    position: 'absolute',
    left: 10,
  },
});
