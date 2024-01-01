import AsyncStorage from '@react-native-async-storage/async-storage';

import log from '../utils/log';
import {Space} from '../utils/types';

const RADIUS_KEY = 'radiusInM';
export const DEFAULT_RADIUS_IN_M = 50;

const SPACES_KEY = 'spaces';
const DEFAULT_SPACES: Space[] = [];

const setRadius = async (value: number) => {
  await AsyncStorage.setItem(RADIUS_KEY, value.toString());
  log.debug(`SET ${RADIUS_KEY}: ${value}`);
};

const setSpaces = async (values: Space[]) => {
  await AsyncStorage.setItem(SPACES_KEY, JSON.stringify(values));
  log.debug(`SET ${SPACES_KEY}: ${JSON.stringify(values, null, 2)}`);
};

const getRadius = async () => {
  const storedValue = await AsyncStorage.getItem(RADIUS_KEY);

  if (storedValue === null) {
    log.debug(`GET ${RADIUS_KEY}: null`);
    setRadius(DEFAULT_RADIUS_IN_M);
    return DEFAULT_RADIUS_IN_M;
  }

  log.debug(`GET ${RADIUS_KEY}: ${storedValue}`);
  return parseInt(storedValue, 10);
};

const getSpaces = async () => {
  const storedValue = await AsyncStorage.getItem(SPACES_KEY);

  if (storedValue === null) {
    log.debug(`GET ${SPACES_KEY}: null`);
    setSpaces(DEFAULT_SPACES);
    return DEFAULT_SPACES;
  }

  log.debug(`GET ${SPACES_KEY}: ${storedValue}`);
  return JSON.parse(storedValue) as Space[];
};

const removeRadius = async () => {
  await AsyncStorage.removeItem(RADIUS_KEY);
  log.debug(`REMOVE ${RADIUS_KEY}`);
};

const removeSpaces = async () => {
  await AsyncStorage.removeItem(SPACES_KEY);
  log.debug(`REMOVE ${SPACES_KEY}`);
};

export default {
  setRadius,
  setSpaces,
  getRadius,
  getSpaces,
  removeRadius,
  removeSpaces,
};
