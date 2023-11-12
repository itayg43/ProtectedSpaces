import React from 'react';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesScreen from './screens/ProtectedSpacesScreen';
import {useAuthContext} from './contexts/authContext';
import {ProtectedSpacesContextProvider} from './contexts/protectedSpacesContext';

const App = () => {
  const {isUserSignedIn} = useAuthContext();

  return isUserSignedIn ? (
    <ProtectedSpacesContextProvider>
      <ProtectedSpacesScreen />
    </ProtectedSpacesContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
