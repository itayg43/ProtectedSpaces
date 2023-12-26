import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import * as geofire from 'geofire-common';

import type {AddSpaceFormData, Location, Space} from '../utils/types';
import {firestoreClient} from '../clients/firebaseClients';
import storageService from './storageService';
import {FirestoreCollection as Collection} from '../utils/enums';
import {commentsSubCollection} from './commentsService';

const spacesColl = firestoreClient.collection<Space>(Collection.Spaces);

const add = async (
  user: FirebaseAuthTypes.User,
  formData: AddSpaceFormData,
) => {
  const docRef = spacesColl.doc(formData.address.id);

  const space: Space = await firestoreClient.runTransaction(async t => {
    const doc = await t.get(docRef);

    if (doc.exists) {
      throw new Error('Space in this address has already been added');
    }

    const newSpace = await createSpace(user, formData);

    t.set(docRef, newSpace);

    return newSpace;
  });

  return space;
};

const findById = async (id: string) => {
  const docSnap = await spacesColl.doc(id).get();

  return docSnap.data() ?? null;
};

const findByUserId = async (
  id: string,
  lastDocument?: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  limit: number = 5,
) => {
  let query = spacesColl.orderBy('createdAt', 'desc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }

  const snap = await query.where('user.id', '==', id).limit(limit).get();

  return {
    spaces: snap.docs.map(doc => doc.data()),
    lastDocument: snap.docs[snap.docs.length - 1],
  };
};

// https://cloud.google.com/firestore/docs/solutions/geoqueries#web-version-9_2

const findByGeohash = async (location: Location, radiusInM: number) => {
  const center: [number, number] = [location.latitude, location.longitude];

  const bounds = geofire.geohashQueryBounds(center, radiusInM);

  const queries = bounds.map(b =>
    spacesColl.orderBy('geohash').startAt(b[0]).endAt(b[1]).get(),
  );

  const snapshots = await Promise.all(queries);

  const spaces: Space[] = [];

  snapshots.forEach(snap => {
    snap.docs.forEach(doc => {
      const currSpace = doc.data();

      const distanceInKm = geofire.distanceBetween(
        [currSpace.latLng.latitude, currSpace.latLng.longitude],
        center,
      );
      const distanceInM = distanceInKm * 1000;

      if (distanceInM <= radiusInM) {
        spaces.push(currSpace);
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

export default {
  add,
  findById,
  findByUserId,
  findByGeohash,
  deleteByIdIncludeComments,
};

async function createSpace(
  user: FirebaseAuthTypes.User,
  formData: AddSpaceFormData,
): Promise<Space> {
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
    },
    description: formData.description,
    user: {
      id: user.uid,
      name: user.displayName ?? '',
    },
    geohash: geofire.geohashForLocation([latLng.latitude, latLng.longitude]),
    latLng: new firestore.GeoPoint(latLng.latitude, latLng.longitude),
    createdAt: firestore.Timestamp.now(),
  };
}
