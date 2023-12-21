import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';
import {LocationContextProvider} from './contexts/locationContext';
import {SpacesContextProvider} from './contexts/spacesContext';
import {ProfileContextProvider} from './contexts/profileContext';

const App = () => {
  const authContext = useAuthContext();

  if (authContext?.status === 'loading') {
    return <LoadingView />;
  }

  return authContext?.user ? (
    <LocationContextProvider>
      <ProfileContextProvider>
        <SpacesContextProvider>
          <SafeAreaInsetsContextProvider>
            <DrawerNavigator />
          </SafeAreaInsetsContextProvider>
        </SpacesContextProvider>
      </ProfileContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
