import AsyncStorage from '@react-native-async-storage/async-storage';

import log from '../utils/log';

const RADIUS_KEY = 'radiusInM';
export const DEFAULT_RADIUS_IN_M = 50;

const setRadius = async (value: number) => {
  await AsyncStorage.setItem(RADIUS_KEY, value.toString());
  log.debug(`SET ${RADIUS_KEY}: ${value}`);
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

const removeRadius = async () => {
  await AsyncStorage.removeItem(RADIUS_KEY);
  log.debug(`REMOVE ${RADIUS_KEY}`);
};

export default {
  setRadius,
  getRadius,
  removeRadius,
};
