import React from 'react';
import {StyleSheet} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import SafeView from '../components/views/SafeView';
import {useAuthContext} from '../contexts/authContext';

const LoginScreen = () => {
  const authContext = useAuthContext();

  return (
    <SafeView contentContainerStyle={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => await authContext.handleSignIn('Google')}
      />
    </SafeView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
