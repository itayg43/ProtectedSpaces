import React from 'react';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesScreen from './screens/ProtectedSpacesScreen';
import {useAuthContext} from './contexts/authContext';

const App = () => {
  const {isUserSignedIn} = useAuthContext();

  return isUserSignedIn ? <ProtectedSpacesScreen /> : <LoginScreen />;
};

export default App;
