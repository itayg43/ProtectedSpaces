import React from 'react';

import LoginScreen from './screens/LoginScreen';
import {useAuthContext} from './contexts/authContext';
import DrawerNavigator from './navigators/DrawerNavigator';
import LoadingView from './components/views/LoadingView';
import {SafeAreaInsetsContextProvider} from './contexts/safeAreaInsetsContext';

const App = () => {
  const {initialRequestStatus, user} = useAuthContext();

  if (initialRequestStatus === 'loading') {
    return <LoadingView />;
  }

  return user ? (
    <SafeAreaInsetsContextProvider>
      <DrawerNavigator />
    </SafeAreaInsetsContextProvider>
  ) : (
    <LoginScreen />
  );
};

export default App;
