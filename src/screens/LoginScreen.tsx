import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import authService from '../services/authService';
import type {AuthProvider} from '../utils/types';
import SafeView from '../components/SafeView';

const LoginScreen = () => {
  const handleSignIn = async (authProvider: AuthProvider) => {
    try {
      await authService.signIn(authProvider);
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong, please try again in a few minutes or contact support',
      );
    }
  };

  return (
    <SafeView contentContainerStyle={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => handleSignIn('Google')}
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
