import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import type {ProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (spaceFormData: ProtectedSpaceFormData) => {
  await protectedSpacesCollection.add({
    ...spaceFormData,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

const collectionSubscription = (
  onChangeCallback: (spaces: ProtectedSpace[]) => void,
  onErrorCallback: (error: Error) => void,
) => {
  return protectedSpacesCollection.onSnapshot(
    query => {
      const spaces = transformData(query);
      onChangeCallback(spaces);
    },
    error => onErrorCallback(error),
  );
};

export default {
  add,
  collectionSubscription,
};

function transformData(
  query: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
) {
  const spaces: ProtectedSpace[] = [];

  query.forEach(document => {
    spaces.push({
      ...document.data(),
      id: document.id,
    } as ProtectedSpace);
  });

  return spaces;
}
