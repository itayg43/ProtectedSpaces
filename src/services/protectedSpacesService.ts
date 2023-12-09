import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import * as geofire from 'geofire-common';

import type {
  AddProtectedSpaceFormData,
  Location,
  ProtectedSpace,
} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';
import {FirestoreCollection as Collection} from '../utils/enums';
import {commentsSubCollection} from './commentsService';

const spacesColl = firestoreClient.collection<ProtectedSpace>(
  Collection.ProtectedSpaces,
);

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
) => {
  await firestoreClient.runTransaction(async t => {
    const docRef = spacesColl.doc(formData.address.id);

    const doc = await t.get(docRef);
    if (doc.exists) {
      throw new Error('Protected space in this address has already been added');
    }

    const protectedSpace = await createProtectedSpace(user, formData);

    t.set(docRef, protectedSpace);
  });
};

const findById = async (id: string) => {
  const doc = await spacesColl.doc(id).get();

  return doc.data() ?? null;
};

const findByUserId = async (id: string) => {
  const query = await spacesColl
    .where('user.id', '==', id)
    .orderBy('createdAt', 'desc')
    .get();

  return query.docs.map(doc => doc.data());
};

// https://cloud.google.com/firestore/docs/solutions/geoqueries#web-version-9_2

const findByGeohash = async (location: Location, radiusInKm = 0.15) => {
  const center: [number, number] = [location.latitude, location.longitude];
  const radiusInM = radiusInKm * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geofire.geohashQueryBounds(center, radiusInM);

  const promises = bounds.map(b =>
    spacesColl.orderBy('geohash').startAt(b[0]).endAt(b[1]).get(),
  );

  const snapshots = await Promise.all(promises);

  const spaces: ProtectedSpace[] = [];

  snapshots.forEach(snap => {
    snap.docs.forEach(doc => {
      const data = doc.data();
      const {latLng} = data.address;

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween(
        [latLng.latitude, latLng.longitude],
        center,
      );
      const distanceInM = distanceInKm * 1000;

      if (distanceInM <= radiusInM) {
        spaces.push(data);
      }
    });
  });

  return spaces;
};

const deleteByIdIncludeComments = async (id: string) => {
  const batch = firestoreClient.batch();

  batch.delete(spacesColl.doc(id));

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
  return spacesColl.onSnapshot(
    query => onChange(query.docs.map(d => d.data())),
    error => onError(error),
  );
};

export default {
  add,
  findById,
  findByUserId,
  findByGeohash,
  deleteByIdIncludeComments,
  collectionSubscription,
};

async function createProtectedSpace(
  user: FirebaseAuthTypes.User,
  formData: AddProtectedSpaceFormData,
): Promise<ProtectedSpace> {
  const {id, latLng} = formData.address;

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
      latLng: new firestore.GeoPoint(latLng.latitude, latLng.longitude),
    },
    description: formData.description,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    geohash: geofire.geohashForLocation([latLng.latitude, latLng.longitude]),
    createdAt: firestore.Timestamp.now(),
  };
}
