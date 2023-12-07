import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import type {AddProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';
import {FirestoreCollection as Collection} from '../utils/enums';
import {commentsSubCollection} from './commentsService';

const protectedSpacesCollection = firestoreClient.collection<ProtectedSpace>(
  Collection.ProtectedSpaces,
);

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
) => {
  await firestoreClient.runTransaction(async t => {
    const docRef = protectedSpacesCollection.doc(formData.address.id);

    const doc = await t.get(docRef);
    if (doc.exists) {
      throw new Error('Protected space in this address has already been added');
    }

    const protectedSpace = await createProtectedSpace(user, formData);

    t.set(docRef, protectedSpace);
  });
};

const findById = async (id: string) => {
  const doc = await protectedSpacesCollection.doc(id).get();

  return doc.data() ?? null;
};

const findByUserId = async (id: string) => {
  const query = await protectedSpacesCollection
    .where('user.id', '==', id)
    .orderBy('createdAt', 'desc')
    .get();

  return query.docs.map(doc => doc.data());
};

const deleteByIdIncludeComments = async (id: string) => {
  const batch = firestoreClient.batch();

  batch.delete(protectedSpacesCollection.doc(id));

  const query = await commentsSubCollection(id).get();
  if (!query.empty) {
    query.forEach(doc => batch.delete(doc.ref));
  }

  await batch.commit();
};

const collectionSubscription = (
  onChange: (s: ProtectedSpace[]) => void,
  onError: (e: Error) => void,
) => {
  return protectedSpacesCollection.onSnapshot(
    query => onChange(query.docs.map(d => d.data())),
    error => onError(error),
  );
};

export default {
  add,
  findById,
  findByUserId,
  deleteByIdIncludeComments,
  collectionSubscription,
};

async function createProtectedSpace(
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
): Promise<ProtectedSpace> {
  const {id} = formData.address;

  await storageService.uploadMultipleImages(formData.images, id);

  return {
    id,
    images: await storageService.getImagesUrls(formData.images, id),
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
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    createdAt: firestore.Timestamp.now(),
  };
}
