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
  const {initialRequestStatus, user} = useAuthContext();

  if (initialRequestStatus === 'loading') {
    return <LoadingView />;
  }

  return user ? (
    <ProfileContextProvider>
      <LocationContextProvider>
        <SpacesContextProvider>
          <SafeAreaInsetsContextProvider>
            <DrawerNavigator />
          </SafeAreaInsetsContextProvider>
        </SpacesContextProvider>
      </LocationContextProvider>
    </ProfileContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
