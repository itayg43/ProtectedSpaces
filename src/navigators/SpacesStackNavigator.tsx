import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import SpacesScreen from '../screens/SpacesScreen';
import SpaceDetailsScreen from '../screens/SpaceDetailsScreen';

type SpacesStackParams = {
  spacesScreen: undefined;
  spaceDetailsScreen: {
    id: string;
  };
};

export type SpacesScreenNavigationProp = NativeStackNavigationProp<
  SpacesStackParams,
  'spacesScreen'
>;

export type SpaceDetailsScreenNavigationProp = NativeStackNavigationProp<
  SpacesStackParams,
  'spaceDetailsScreen'
>;

export type SpaceDetailsScreenRouteProp = RouteProp<
  SpacesStackParams,
  'spaceDetailsScreen'
>;

const Stack = createNativeStackNavigator<SpacesStackParams>();

const SpacesStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="spacesScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="spacesScreen" component={SpacesScreen} />

      <Stack.Screen name="spaceDetailsScreen" component={SpaceDetailsScreen} />
    </Stack.Navigator>
  );
};

export default SpacesStackNavigator;
