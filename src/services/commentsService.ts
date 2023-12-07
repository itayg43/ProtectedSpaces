import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';

import type {AddCommentFormData, Comment} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import {
  FirestoreCollection as Collection,
  FirestoreSubCollection as SubColletion,
} from '../utils/enums';

export const commentsSubCollection = (protectedSpaceId: string) =>
  firestoreClient.collection(
    `${Collection.ProtectedSpaces}/${protectedSpaceId}/${SubColletion.Comments}`,
  );

const commentsSubCollectionGroup = firestoreClient.collectionGroup<Comment>(
  SubColletion.Comments,
);

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
  protectedSpaceId: string,
) => {
  const comment = createComment(user, formData);

  await commentsSubCollection(protectedSpaceId).doc(comment.id).set(comment);
};

const findByUserId = async (id: string) => {
  const query = await commentsSubCollectionGroup
    .where('user.id', '==', id)
    .orderBy('createdAt', 'desc')
    .get();

  return query.docs.map(doc => doc.data());
};

const collectionSubscription = (
  protectedSpaceId: string,
  onChange: (c: Comment[]) => void,
  onError: (e: Error) => void,
) => {
  return commentsSubCollection(protectedSpaceId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      query => onChange(query.docs.map(d => d.data()) as Comment[]),
      error => onError(error),
    );
};

export default {
  add,
  findByUserId,
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
