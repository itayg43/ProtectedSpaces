import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import LoginScreen from './screens/LoginScreen';
import ProtectedSpacesMapScreen from './screens/ProtectedSpacesMapScreen';

const App = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(
    null,
  );

  const handleAuthStateChange = (user: FirebaseAuthTypes.User | null) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    const authSubscription = auth().onAuthStateChanged(handleAuthStateChange);

    return authSubscription;
  }, []);

  return currentUser ? <ProtectedSpacesMapScreen /> : <LoginScreen />;
};

export default App;
