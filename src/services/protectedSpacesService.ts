import firestore from '@react-native-firebase/firestore';

import type {
  AddProtectedSpaceFormData,
  ProtectedSpace,
  ProtectedSpaceWithoutId,
} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (formData: AddProtectedSpaceFormData) => {
  await storageService.uploadImage(formData.image);

  const spaceWithoutId: ProtectedSpaceWithoutId = {
    imageUrl: await storageService.getImageUrl(formData.image.name),
    type: formData.type,
    address: {
      city: formData.address.city,
      street: formData.address.street,
      buildingNumber: formData.address.buildingNumber,
    },
    googleMapsLinkUrl: formData.address.googleMapsLinkUrl,
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
