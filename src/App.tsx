import React, {useState, useEffect} from 'react';

import authService from './services/authService';
import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesScreen from './screens/ProtectedSpacesScreen';

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(user =>
      setIsUserSignedIn(!!user),
    );

    return unsubscribe;
  }, []);

  return isUserSignedIn ? <ProtectedSpacesScreen /> : <LoginScreen />;
};

export default App;
