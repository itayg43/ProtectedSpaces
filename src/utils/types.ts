import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type AuthProvider = 'Apple' | 'Google';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type Location = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
};

export type ProtectedSpaceFormData = {
  address: string;
  description: string;
  imageUrl: string;
  coordinate: FirebaseFirestoreTypes.GeoPoint;
};

export type ProtectedSpace = {
  id: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
} & ProtectedSpaceFormData;
