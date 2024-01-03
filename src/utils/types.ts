import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import * as z from 'zod';

import {
  addCommentValidationSchema,
  addSpaceValidationSchema,
} from './validationSchemas';

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

export type Address = {
  city: string;
  street: string;
  number: string;
  url: string;
};

export type Comment = {
  id: string;
  spaceId: string;
  value: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type Space = {
  id: string;
  images: string[];
  type: string;
  address: Address;
  description: string;
  user: {
    id: string;
    name: string;
  };
  geohash: string;
  latLng: FirebaseFirestoreTypes.GeoPoint;
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type LocalStoredSpace = {
  id: string;
  address: Address;
  createdAt: number;
};

export type AddSpaceFormData = z.infer<typeof addSpaceValidationSchema>;

export type AddCommentFormData = z.infer<typeof addCommentValidationSchema>;

export type ImageAsset = {
  name: string;
  uri: string;
};

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
