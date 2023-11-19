import firestore from '@react-native-firebase/firestore';

import type {
  AddProtectedSpaceFormData,
  ProtectedSpace,
  ProtectedSpaceWithoutId,
} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (
  user: FirebaseAuthTypes.User | null,
  formData: AddProtectedSpaceFormData,
) => {
  await storageService.uploadMultipleImages(formData.images);

  const spaceWithoutId: ProtectedSpaceWithoutId = {
    images: await storageService.getImagesUrls(formData.images),

    type: formData.type,

    address: {
      city: formData.address.city,
      street: formData.address.street,
      number: formData.address.number,
      url: formData.address.url,
      latLng: new firestore.GeoPoint(
        formData.address.latLng.latitude,
        formData.address.latLng.longitude,
      ),
    },

    description: formData.description,

    createdAt: firestore.Timestamp.now(),

    user: {
      id: user?.uid ?? '',
      name: user?.displayName ?? '',
      photo: user?.photoURL ?? '',
    },
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
