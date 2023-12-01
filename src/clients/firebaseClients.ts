import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import type {ProtectedSpace} from '../utils/types';

enum Collection {
  ProtectedSpaces = 'ProtectedSpaces',
}

enum SubCollection {
  Comments = 'Comments',
}

// AUTH

export const authClient = auth();

// FIRESTORE

const db = firestore();

const protectedSpacesCollection = db.collection<ProtectedSpace>(
  Collection.ProtectedSpaces,
);

const commentsSubCollection = (protectedSpaceId: string) =>
  protectedSpacesCollection
    .doc(protectedSpaceId)
    .collection(SubCollection.Comments);

export const firestoreClient = {
  protectedSpacesCollection,
  commentsSubCollection,
};

// STORAGE

export const storageClient = storage();
