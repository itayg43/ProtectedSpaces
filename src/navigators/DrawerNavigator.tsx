import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Divider} from 'react-native-paper';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SpacesStackNavigator from './SpacesStackNavigator';
import {useAuthContext} from '../contexts/authContext';
import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import UserProfileScreen from '../screens/UserProfileScreen';
import UserDataScreen from '../screens/UserDataScreen';

type DrawerParams = {
  spacesStack: undefined;
  userProfileScreen: undefined;
  userDataScreen: undefined;
};

export type SpacesStackNavigationProp = DrawerNavigationProp<
  DrawerParams,
  'spacesStack'
>;

export type UserProfileScreenNavigationProps = DrawerNavigationProp<
  DrawerParams,
  'userProfileScreen'
>;

export type UserDataScreenNavigationProps = DrawerNavigationProp<
  DrawerParams,
  'userDataScreen'
>;

const Drawer = createDrawerNavigator<DrawerParams>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="spacesStack"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={DrawerContent}>
      <Drawer.Screen name="spacesStack" component={SpacesStackNavigator} />

      <Drawer.Screen
        name="userProfileScreen"
        component={UserProfileScreen}
        options={{
          unmountOnBlur: true,
        }}
      />

      <Drawer.Screen
        name="userDataScreen"
        component={UserDataScreen}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

function DrawerContent({navigation}: DrawerContentComponentProps) {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const authContext = useAuthContext();

  return (
    <View
      style={[
        styles.container,
        {marginTop: safeAreaInsets.top, marginBottom: safeAreaInsets.bottom},
      ]}>
      <DrawerListItem
        label={authContext?.user?.displayName ?? ''}
        icon="face-man-profile"
        onPress={() => navigation.navigate('userProfileScreen')}
      />

      <DrawerListItem
        label="My Spaces & Comments"
        icon="home-city"
        onPress={() => navigation.navigate('userDataScreen')}
      />
      <Divider />

      <DrawerListItem
        label="Sign Out"
        icon="logout"
        onPress={async () => await authContext?.handleSignOut()}
      />
      <Divider />

      <Text style={[styles.versionText, {bottom: safeAreaInsets.bottom}]}>
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
