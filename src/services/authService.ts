import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {GOOGLE_SIGN_IN_WEB_CLIENT_ID} from '@env';
import type {AuthProvider} from '../utils/types';

GoogleSignin.configure({
  webClientId: GOOGLE_SIGN_IN_WEB_CLIENT_ID,
});

const signIn = async (provider: AuthProvider) => {
  provider === 'Google' ? await googleSignIn() : await appleSignIn();
};

const signOut = async () => {
  await auth().signOut();
};

const getCurrentUser = () => {
  return auth().currentUser;
};

const stateSubscription = (
  onChangeCallback: (user: FirebaseAuthTypes.User | null) => void,
) => {
  return auth().onAuthStateChanged(onChangeCallback);
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
  await auth().signInWithCredential(credential);
}

async function appleSignIn() {}
