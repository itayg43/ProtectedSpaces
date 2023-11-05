import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import type {AuthProvider} from '../utils/types';

GoogleSignin.configure({
  webClientId:
    '895570054208-902hue55r6c4u4a6fo0t434nm231uq28.apps.googleusercontent.com',
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
