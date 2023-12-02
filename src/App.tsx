import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return <LoadingView />;
  }

  return user ? (
    <SafeAreaInsetsContextProvider>
      <DrawerNavigator />
    </SafeAreaInsetsContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
