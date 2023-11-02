import React from 'react';
import {StyleSheet} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import authService from '../services/authService';
import SafeView from '../components/SafeView';

const LoginScreen = () => {
  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeView contentContainerStyle={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
        // disabled={this.state.isSigninInProgress}
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
