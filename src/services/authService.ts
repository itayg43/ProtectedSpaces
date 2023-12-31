import {Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {
  IOS_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  ANDROID_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
} from '@env';
import type {AuthProvider} from '../utils/types';
import {authClient} from '../clients/firebaseClients';

GoogleSignin.configure({
  webClientId:
    Platform.OS === 'ios'
      ? IOS_GOOGLE_SIGN_IN_WEB_CLIENT_ID
      : ANDROID_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
});

const signIn = async (provider: AuthProvider) => {
  provider === 'Google' ? await googleSignIn() : await appleSignIn();
};

const signOut = async () => {
  await authClient.signOut();
};

const stateSubscription = (
  onChange: (u: FirebaseAuthTypes.User | null) => void,
) => {
  return authClient.onAuthStateChanged(onChange);
};

const getCurrentUser = () => {
  return authClient.currentUser;
};

export default {
  signIn,
  signOut,
  stateSubscription,
  getCurrentUser,
};

async function googleSignIn() {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  const {idToken} = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(idToken);
  await authClient.signInWithCredential(credential);
}

async function appleSignIn() {}
