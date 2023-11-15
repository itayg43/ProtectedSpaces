import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';
import {LocationContextProvider} from './contexts/locationContext';
import LoadingView from './components/LoadingView';
import ProtectedSpacesStackNavigator from './navigators/ProtectedSpacesStack';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return <LoadingView />;
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
