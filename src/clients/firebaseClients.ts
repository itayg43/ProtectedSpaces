import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import type {ProtectedSpace, Comment} from '../utils/types';

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

export const firestoreClient = {
  // PROTECTED SPACES

  protectedSpacesCollection: db.collection<ProtectedSpace>(
    Collection.ProtectedSpaces,
  ),

  // COMMENTS

  commentsSubCollection: (protectedSpaceId: string) =>
    db
      .collection<Comment>(Collection.ProtectedSpaces)
      .doc(protectedSpaceId)
      .collection(SubCollection.Comments),

  commentsSubCollectionGroup: db.collectionGroup<Comment>(
    SubCollection.Comments,
  ),

  // BATCH

  batch: db.batch(),
};

// STORAGE

export const storageClient = storage();
