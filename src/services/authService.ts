import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '895570054208-902hue55r6c4u4a6fo0t434nm231uq28.apps.googleusercontent.com',
});

const googleSignIn = async () => {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  const {idToken} = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(idToken);
  await auth().signInWithCredential(credential);
};

const signOut = async () => {
  await auth().signOut();
};

const getCurrentUser = () => {
  return auth().currentUser;
};

export default {
  googleSignIn,
  getCurrentUser,
  signOut,
};
