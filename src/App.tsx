import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';
import {LocationContextProvider} from './contexts/locationContext';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return <LoadingView />;
  }

  return user ? (
    <LocationContextProvider>
      <SafeAreaInsetsContextProvider>
        <DrawerNavigator />
      </SafeAreaInsetsContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
