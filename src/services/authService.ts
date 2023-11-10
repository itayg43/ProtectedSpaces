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

const getCurrentUser = () => {
  return authClient.currentUser;
};

const stateSubscription = (
  onChangeCallback: (user: FirebaseAuthTypes.User | null) => void,
) => {
  return authClient.onAuthStateChanged(onChangeCallback);
};

export default {
  getCurrentUser,
  signIn,
  signOut,
  stateSubscription,
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
