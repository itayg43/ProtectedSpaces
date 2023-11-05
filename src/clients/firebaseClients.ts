import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const authClient = auth();

export const firestoreClient = firestore();
