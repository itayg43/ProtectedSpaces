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
