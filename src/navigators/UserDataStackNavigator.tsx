import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import UserDataScreen from '../screens/UserDataScreen';

type UserDataStackParams = {
  userDataScreen: undefined;
};

export type UserDataScreenNavigationProp = NativeStackNavigationProp<
  UserDataStackParams,
  'userDataScreen'
>;

const Stack = createNativeStackNavigator<UserDataStackParams>();

const UserDataStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="userDataScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="userDataScreen" component={UserDataScreen} />
    </Stack.Navigator>
  );
};

export default UserDataStackNavigator;
