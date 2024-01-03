import AsyncStorage from '@react-native-async-storage/async-storage';

import type {LocalStoredSpace, Space} from '../utils/types';

const RADIUS_KEY = 'radiusInM';
export const DEFAULT_RADIUS_IN_M = 50;

const SPACES_KEY = 'spaces';
const DEFAULT_SPACES: LocalStoredSpace[] = [];

// RADIUS

const setRadius = async (value: number) => {
  await AsyncStorage.setItem(RADIUS_KEY, value.toString());
};

const getRadius = async () => {
  const storedValue = await AsyncStorage.getItem(RADIUS_KEY);
  return storedValue ? parseInt(storedValue, 10) : DEFAULT_RADIUS_IN_M;
};

const removeRadius = async () => {
  await AsyncStorage.removeItem(RADIUS_KEY);
};

// SPACES

const setSpaces = async (values: Space[]) => {
  const valuesToStore = values.map(v => ({
    id: v.id,
    address: v.address,
    createdAt: v.createdAt.toMillis(),
  })) as LocalStoredSpace[];
  await AsyncStorage.setItem(SPACES_KEY, JSON.stringify(valuesToStore));
};

const getSpaces = async (): Promise<LocalStoredSpace[]> => {
  const storedValues = await AsyncStorage.getItem(SPACES_KEY);
  return storedValues ? JSON.parse(storedValues) : DEFAULT_SPACES;
};

const removeSpaces = async () => {
  await AsyncStorage.removeItem(SPACES_KEY);
};

export default {
  setRadius,
  getRadius,
  removeRadius,
  setSpaces,
  getSpaces,
  removeSpaces,
};
