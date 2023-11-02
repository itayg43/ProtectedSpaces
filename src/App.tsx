import React, {useEffect, useState} from 'react';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesMapScreen from './screens/ProtectedSpacesMapScreen';
import authService from './services/authService';

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    const authUnsubscribe = authService.stateSubscription(user =>
      setIsUserSignedIn(!!user),
    );

    return authUnsubscribe;
  }, []);

  return isUserSignedIn ? <ProtectedSpacesMapScreen /> : <LoginScreen />;
};

export default App;
