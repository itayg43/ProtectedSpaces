import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import type {ProtectedSpace} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import {AddProtectedSpaceFormData} from '../components/AddProtectedSpaceForm';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (formData: AddProtectedSpaceFormData) => {
  await protectedSpacesCollection.add({
    type: formData.type,
    address: formData.address.value,
    description: formData.description,
    coordinate: new firestore.GeoPoint(
      formData.address.coordinate.latitude,
      formData.address.coordinate.longitude,
    ),
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
