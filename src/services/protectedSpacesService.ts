import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

import type {
  AddCommentFormData,
  AddProtectedSpaceFormData,
  Comment,
  ProtectedSpace,
} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const protectedSpacesCollection = firestoreClient.collection('ProtectedSpaces');

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
) => {
  await storageService.uploadMultipleImages(formData.images);

  const protectedSpace: ProtectedSpace = {
    id: formData.address.id,
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
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    comments: [],
    createdAt: firestore.Timestamp.now(),
  };

  await protectedSpacesCollection.doc(protectedSpace.id).set(protectedSpace);
};

const addComment = async (
  user: FirebaseAuthTypes.User,
  formData: AddCommentFormData,
  protectedSpace: ProtectedSpace,
) => {
  const comment: Comment = {
    id: uuidv4(),
    value: formData.value,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    createdAt: firestore.Timestamp.now(),
  };

  await protectedSpacesCollection.doc(protectedSpace.id).update({
    comments: [...protectedSpace.comments, comment],
  });
};

const collectionSubscription = (
  onChangeCallback: (spaces: ProtectedSpace[]) => void,
  onErrorCallback: (error: Error) => void,
) => {
  return protectedSpacesCollection.onSnapshot(
    query => {
      const spaces: ProtectedSpace[] = [];
      query.forEach(doc => spaces.push(doc.data() as ProtectedSpace));
      onChangeCallback(spaces);
    },
    error => onErrorCallback(error),
  );
};

export default {
  add,
  addComment,
  collectionSubscription,
};
