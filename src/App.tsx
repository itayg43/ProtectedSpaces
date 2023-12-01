import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return null;
  }

  return user ? <DrawerNavigator /> : <LoginScreen />;
};

export default App;
