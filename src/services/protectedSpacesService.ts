import firestore from '@react-native-firebase/firestore';

import type {
  AddProtectedSpaceFormData,
  ProtectedSpace,
  ProtectedSpaceWithoutId,
} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (formData: AddProtectedSpaceFormData) => {
  const spaceWithoutId: ProtectedSpaceWithoutId = {
    type: formData.type,
    address: formData.address.value,
    description: formData.description,
    coordinate: new firestore.GeoPoint(
      formData.address.coordinate.latitude,
      formData.address.coordinate.longitude,
    ),
    createdAt: firestore.Timestamp.now(),
  };

  await protectedSpacesCollection.add(spaceWithoutId);
};

const collectionSubscription = (
  onChangeCallback: (spaces: ProtectedSpace[]) => void,
  onErrorCallback: (error: Error) => void,
) => {
  return protectedSpacesCollection.onSnapshot(
    query => {
      const spaces: ProtectedSpace[] = [];

      query.forEach(document => {
        spaces.push({
          ...document.data(),
          id: document.id,
        } as ProtectedSpace);
      });

      onChangeCallback(spaces);
    },
    error => onErrorCallback(error),
  );
};

export default {
  add,
  collectionSubscription,
};
