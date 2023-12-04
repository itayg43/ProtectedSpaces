import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';

import type {AddCommentFormData, Comment} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
  protectedSpaceId: string,
) => {
  const comment = createComment(user, formData);

  await firestoreClient
    .commentsSubCollection(protectedSpaceId)
    .doc(comment.id)
    .set(comment);
};

const findByUserId = async (id: string) => {
  const query = await firestoreClient.commentsSubCollectionGroup
    .where('user.id', '==', id)
    .orderBy('createdAt', 'desc')
    .get();

  return query.docs.map(doc => doc.data());
};

const deleteByProtectedSpaceId = async (id: string) => {
  const query = await firestoreClient.commentsSubCollection(id).get();

  if (query.empty) {
    return;
  }

  query.forEach(doc => firestoreClient.batch.delete(doc.ref));

  await firestoreClient.batch.commit();
};

const collectionSubscription = (
  protectedSpaceId: string,
  onChange: (c: Comment[]) => void,
  onError: (e: Error) => void,
) => {
  return firestoreClient
    .commentsSubCollection(protectedSpaceId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      query => onChange(query.docs.map(d => d.data()) as Comment[]),
      error => onError(error),
    );
};

export default {
  add,
  findByUserId,
  deleteByProtectedSpaceId,
  collectionSubscription,
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
