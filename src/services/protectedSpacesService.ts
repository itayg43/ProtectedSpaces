import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {v4 as uuidv4} from 'uuid';

import type {AddProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';

const addProtectedSpace = async (
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
) => {
  const protectedSpace = await createProtectedSpace(user, formData);

  await firestoreClient.protectedSpacesCollection
    .doc(protectedSpace.id)
    .set(protectedSpace);
};

const findProtectedSpaceById = async (id: string) => {
  const doc = await firestoreClient.protectedSpacesCollection.doc(id).get();

  return doc.data() ?? null;
};

const collectionSubscription = (
  onChange: (s: ProtectedSpace[]) => void,
  onError: (e: Error) => void,
) => {
  return firestoreClient.protectedSpacesCollection.onSnapshot(
    query => onChange(query.docs.map(d => d.data())),
    error => onError(error),
  );
};

export default {
  addProtectedSpace,
  findProtectedSpaceById,
  collectionSubscription,
};

async function createProtectedSpace(
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
): Promise<ProtectedSpace> {
  await storageService.uploadMultipleImages(formData.images);

  return {
    id: uuidv4(),
    images: await storageService.getImagesUrls(formData.images),
    type: formData.type,
    address: {
      ...formData.address,
      latLng: new firestore.GeoPoint(
        formData.address.latLng.latitude,
        formData.address.latLng.longitude,
      ),
    },
    description: formData.description,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    createdAt: firestore.Timestamp.now(),
  };
}
