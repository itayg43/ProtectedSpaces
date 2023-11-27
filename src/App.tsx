import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';
import {LocationContextProvider} from './contexts/locationContext';
import DrawerNavigator from './navigators/DrawerNavigator';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return null;
  }

  return user ? (
    <LocationContextProvider>
      <ProtectedSpacesContextProvider>
        <DrawerNavigator />
      </ProtectedSpacesContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
