import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesMapScreen from './screens/ProtectedSpacesMapScreen';

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const handleAuthStateChange = (user: FirebaseAuthTypes.User | null) => {
    setIsUserSignedIn(!!user);
  };

  useEffect(() => {
    const authSubscription = auth().onAuthStateChanged(handleAuthStateChange);

    return authSubscription;
  }, []);

  return isUserSignedIn ? <ProtectedSpacesMapScreen /> : <LoginScreen />;
};

export default App;
