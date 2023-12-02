import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';
import {LocationContextProvider} from './contexts/locationContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';

const App = () => {
  const {status, user} = useAuthContext();

  if (status === 'initializing') {
    return <LoadingView />;
  }

  return user ? (
    <LocationContextProvider>
      <ProtectedSpacesContextProvider>
        <SafeAreaInsetsContextProvider>
          <DrawerNavigator />
        </SafeAreaInsetsContextProvider>
      </ProtectedSpacesContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
