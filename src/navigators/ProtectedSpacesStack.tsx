import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import ProtectedSpacesScreen from '../screens/ProtectedSpacesScreen';
import ProtectedSpaceDetailsScreen from '../screens/ProtectedSpaceDetailsScreen';

type ProtectedSpacesStackParams = {
  protectedSpacesScreen: undefined;
  protectedSpaceDetailsScreen: {
    id: string;
  };
};

export type ProtectedSpacesScreenNavigationProp = NativeStackNavigationProp<
  ProtectedSpacesStackParams,
  'protectedSpacesScreen'
>;

export type ProtectedSpaceDetailsScreenNavigationProp =
  NativeStackNavigationProp<
    ProtectedSpacesStackParams,
    'protectedSpaceDetailsScreen'
  >;

export type ProtectedSpaceDetailsScreenRouteProp = RouteProp<
  ProtectedSpacesStackParams,
  'protectedSpaceDetailsScreen'
>;

const Stack = createNativeStackNavigator<ProtectedSpacesStackParams>();

const ProtectedSpacesStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="protectedSpacesScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="protectedSpacesScreen"
        component={ProtectedSpacesScreen}
      />

      <Stack.Screen
        name="protectedSpaceDetailsScreen"
        component={ProtectedSpaceDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default ProtectedSpacesStackNavigator;
