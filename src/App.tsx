import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';

const App = () => {
  const {status, user} = useAuthContext();

  if (status === 'initializing') {
    return <LoadingView />;
  }

  return user ? (
    <ProtectedSpacesContextProvider>
      <SafeAreaInsetsContextProvider>
        <DrawerNavigator />
      </SafeAreaInsetsContextProvider>
    </ProtectedSpacesContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
