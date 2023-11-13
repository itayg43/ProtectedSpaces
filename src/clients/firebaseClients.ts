import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const authClient = auth();

export const firestoreClient = firestore();

export const storageClient = storage();
