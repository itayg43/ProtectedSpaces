import {ProtectedSpaceType} from './enums';

export const PROTECTED_SPACE_TYPE_OPTIONS = Object.entries(
  ProtectedSpaceType,
).map(([key, value]) => ({
  label: key,
  value,
}));
