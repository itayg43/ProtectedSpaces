import AsyncStorage from '@react-native-async-storage/async-storage';

import type {LocalStoredSpace} from '../utils/types';
import log from '../utils/log';

const RADIUS_KEY = 'radiusInM';
export const DEFAULT_RADIUS_IN_M = 50;

const SPACES_KEY = 'spaces';
const DEFAULT_SPACES: LocalStoredSpace[] = [];

// RADIUS

const setRadius = async (value: number) => {
  await AsyncStorage.setItem(RADIUS_KEY, value.toString());
  log.debug(`SET RADIUS: ${value}`);
};

const getRadius = async () => {
  const storedValue = await AsyncStorage.getItem(RADIUS_KEY);
  const value = storedValue ? parseInt(storedValue, 10) : DEFAULT_RADIUS_IN_M;
  log.debug(`GET RADIUS: ${value}`);
  return value;
};

const removeRadius = async () => {
  await AsyncStorage.removeItem(RADIUS_KEY);
  log.debug('REMOVE RADIUS');
};

// SPACES

const setSpaces = async (values: LocalStoredSpace[]) => {
  await AsyncStorage.setItem(SPACES_KEY, JSON.stringify(values));
  log.debug(`SET SPACES: ${JSON.stringify(values, null, 2)}`);
};

const getSpaces = async (): Promise<LocalStoredSpace[]> => {
  const storedValues = await AsyncStorage.getItem(SPACES_KEY);
  const values = storedValues ? JSON.parse(storedValues) : DEFAULT_SPACES;
  log.debug(`GET SPACES: ${JSON.stringify(values, null, 2)}`);
  return values;
};

const removeSpaces = async () => {
  await AsyncStorage.removeItem(SPACES_KEY);
  log.debug('REMOVE SPACES');
};

export default {
  setRadius,
  getRadius,
  removeRadius,
  setSpaces,
  getSpaces,
  removeSpaces,
};
