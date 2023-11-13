import React from 'react';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesScreen from './screens/ProtectedSpacesScreen';
import {useAuthContext} from './contexts/authContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';
import {LocationContextProvider} from './contexts/locationContext';
import LoadingView from './components/LoadingView';

const App = () => {
  const {isInitializing, user} = useAuthContext();

  if (isInitializing) {
    return <LoadingView />;
  }

  return user ? (
    <LocationContextProvider>
      <ProtectedSpacesContextProvider>
        <ProtectedSpacesScreen />
      </ProtectedSpacesContextProvider>
    </LocationContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
