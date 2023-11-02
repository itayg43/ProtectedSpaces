import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import authService from '../services/authService';
import {type AuthProvider, type RequestStatus} from '../utils/types';
import SafeView from '../components/SafeView';

const LoginScreen = () => {
  const [signInRequestStatus, setSignInRequestStatus] =
    useState<RequestStatus>('idle');

  const handleSignIn = async (authProvider: AuthProvider) => {
    try {
      setSignInRequestStatus('loading');
      await authService.signIn(authProvider);
      setSignInRequestStatus('succeeded');
    } catch (error) {
      setSignInRequestStatus('failed');
    }
  };

  return (
    <SafeView contentContainerStyle={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => handleSignIn('Google')}
        disabled={signInRequestStatus === 'loading'}
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
