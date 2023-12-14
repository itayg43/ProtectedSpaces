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
  const comment = createComment(user, formData);

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

const findByUserId = async (id: string) => {
  const query = await commentsSubCollectionGroup
    .where('user.id', '==', id)
    .orderBy('createdAt', 'desc')
    .get();

  return query.docs.map(doc => doc.data());
};

export default {
  add,
  findBySpaceId,
  findByUserId,
};

function createComment(
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
): Comment {
  return {
    id: uuidv4(),
    value: formData.value,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    createdAt: firestore.Timestamp.now(),
  };
}
