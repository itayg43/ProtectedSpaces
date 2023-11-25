import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';
import {LocationContextProvider} from './contexts/locationContext';
import ProtectedSpacesStackNavigator from './navigators/ProtectedSpacesStack';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return null;
  }

  return user ? (
    <LocationContextProvider>
      <ProtectedSpacesContextProvider>
        <ProtectedSpacesStackNavigator />
      </ProtectedSpacesContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
