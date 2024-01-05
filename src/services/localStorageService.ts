import AsyncStorage from '@react-native-async-storage/async-storage';

import type {Space, UserSpace} from '../utils/types';
import log from '../utils/log';
import {convertSpaceToUserSpace} from '../contexts/spacesContext';

const RADIUS_KEY = 'radiusInM';
export const DEFAULT_RADIUS_IN_M = 50;

const USER_SPACES_KEY = 'userSpaces';
const DEFAULT_USER_SPACES: UserSpace[] = [];

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

// USER SPACES
const setUserSpaces = async (values: UserSpace[]) => {
  await AsyncStorage.setItem(USER_SPACES_KEY, JSON.stringify(values));
  log.debug('SET USER SPACES');
};

const getUserSpaces = async (): Promise<UserSpace[]> => {
  const storedValues = await AsyncStorage.getItem(USER_SPACES_KEY);
  const values = storedValues ? JSON.parse(storedValues) : DEFAULT_USER_SPACES;
  log.debug('GET USER SPACES');
  return values;
};

const addUserSpace = async (value: Space) => {
  const storedValues = await getUserSpaces();
  const userSpace = convertSpaceToUserSpace(value);
  setUserSpaces([userSpace, ...storedValues]);
  log.debug('ADD USER SPACE');
};

const deleteUserSpace = async (id: string) => {
  const storedValues = await getUserSpaces();
  const updatedValues = storedValues.filter(v => v.id !== id);
  setUserSpaces(updatedValues);
  log.debug('DELETE USER SPACE');
};

const removeUserSpaces = async () => {
  await AsyncStorage.removeItem(USER_SPACES_KEY);
  log.debug('REMOVE USER SPACES');
};

export default {
  setRadius,
  getRadius,
  removeRadius,
  setUserSpaces,
  getUserSpaces,
  addUserSpace,
  deleteUserSpace,
  removeUserSpaces,
};
