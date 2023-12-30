import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';

import SafeView from '../components/views/SafeView';
import {useAuthContext} from '../contexts/authContext';
import {ActivityIndicator} from 'react-native-paper';

const LoginScreen = () => {
  const authContext = useAuthContext();

  return (
    <SafeView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Protected Spaces</Text>

      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => await authContext.handleSignIn('Google')}
          disabled={authContext.status === 'loading'}
        />

        {authContext.status === 'loading' && (
          <ActivityIndicator style={styles.activityIndicator} />
        )}
      </View>
    </SafeView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },

  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },

  activityIndicator: {
    marginTop: 20,
  },
});
