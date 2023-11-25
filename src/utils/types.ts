import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import * as z from 'zod';

import {
  addCommentValidationSchema,
  addProtectedSpaceValidationSchema,
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

export type Comment = {
  id: string;
  value: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type ProtectedSpace = {
  id: string;
  images: string[];
  type: string;
  address: {
    city: string;
    street: string;
    number: string;
    url: string;
    latLng: FirebaseFirestoreTypes.GeoPoint;
  };
  description: string;
  user: {
    id: string;
    name: string;
  };
  comments: Comment[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
};

export type AddProtectedSpaceFormData = z.infer<
  typeof addProtectedSpaceValidationSchema
>;

export type AddCommentFormData = z.infer<typeof addCommentValidationSchema>;

export type ImageAsset = {
  name: string;
  uri: string;
};
