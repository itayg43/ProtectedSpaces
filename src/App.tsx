import React from 'react';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesMapScreen from './screens/ProtectedSpacesMapScreen';
import {ProtectedSpacesProvider} from './contexts/ProtectedSpacesContext';
import {useAuthContext} from './contexts/AuthContext';

const App = () => {
  const {isUserSignedIn} = useAuthContext();

  return isUserSignedIn ? (
    <ProtectedSpacesProvider>
      <ProtectedSpacesMapScreen />
    </ProtectedSpacesProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
