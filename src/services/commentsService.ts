import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

import type {AddCommentFormData, Comment} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import {
  FirestoreCollection as Collection,
  FirestoreSubCollection as SubColletion,
} from '../utils/enums';

export const commentsSubCollection = (spaceId: string) =>
  firestoreClient.collection(
    `${Collection.Spaces}/${spaceId}/${SubColletion.Comments}`,
  );

const commentsSubCollectionGroup = firestoreClient.collectionGroup<Comment>(
  SubColletion.Comments,
);

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
  spaceId: string,
) => {
  const comment = createComment(user, formData, spaceId);

  await commentsSubCollection(spaceId).doc(comment.id).set(comment);

  return comment;
};

const findBySpaceId = async (
  id: string,
  lastDocument?: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  limit: number = 5,
) => {
  let query = commentsSubCollection(id).orderBy('createdAt', 'desc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }

  const snap = await query.limit(limit).get();

  return {
    comments: snap.docs.map(doc => doc.data()) as Comment[],
    lastDocument: snap.docs[snap.docs.length - 1],
  };
};

const findByUserId = async (
  id: string,
  lastDocument?: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  limit: number = 5,
) => {
  let query = commentsSubCollectionGroup.orderBy('createdAt', 'desc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }

  const snap = await query.where('user.id', '==', id).limit(limit).get();

  return {
    comments: snap.docs.map(doc => doc.data()),
    lastDocument: snap.docs[snap.docs.length - 1],
  };
};

const deleteById = async (spaceId: string, commentId: string) => {
  await commentsSubCollection(spaceId).doc(commentId).delete();
};

export default {
  add,
  findBySpaceId,
  findByUserId,
  deleteById,
};

function createComment(
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
  spaceId: string,
): Comment {
  return {
    id: uuidv4(),
    spaceId,
    value: formData.value,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    createdAt: firestore.Timestamp.now(),
  };
}
