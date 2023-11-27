import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import ProtectedSpacesStackNavigator from './ProtectedSpacesStackNavigator';

type DrawerParams = {
  protectedSpacesStack: undefined;
};

export type ProtectedSpacesStackNavigationProp = DrawerNavigationProp<
  DrawerParams,
  'protectedSpacesStack'
>;

const Drawer = createDrawerNavigator<DrawerParams>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="protectedSpacesStack"
        component={ProtectedSpacesStackNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
