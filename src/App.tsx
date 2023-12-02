import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return <LoadingView />;
  }

  return user ? <DrawerNavigator /> : <LoginScreen />;
};

export default App;
