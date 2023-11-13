import {ProtectedSpaceType} from './enums';

export const PROTECTED_SPACE_TYPE_OPTIONS = Object.entries(
  ProtectedSpaceType,
).map(([key, value]) => ({
  label: key,
  value,
}));

export const DEFAULT_MAP_DELTAS = {
  LATITUDE: 0.01,
  LONGITUDE: 0.01,
};

export const DEFAULT_MAP_REGION = {
  latitude: 31.5,
  longitude: 34.75,
  latitudeDelta: 3,
  longitudeDelta: 0.01,
};
