import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import * as z from 'zod';

import {addProtectedSpaceValidationSchema} from './validationSchemas';

export type AuthProvider = 'Apple' | 'Google';

export type Location = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export type ProtectedSpace = {
  id: string;
  imagesUrls: string[];
  type: string;
  address: {
    city: string;
    street: string;
    buildingNumber: string;
  };
  googleMapsLinkUrl: string;
  description: string;
  createdBy: {
    name: string;
    photoUrl: string;
  };
  coordinate: FirebaseFirestoreTypes.GeoPoint;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type ProtectedSpaceWithoutId = Omit<ProtectedSpace, 'id'>;

export type AddProtectedSpaceFormData = z.infer<
  typeof addProtectedSpaceValidationSchema
>;

export type ImageAsset = {
  name: string;
  uri: string;
};
