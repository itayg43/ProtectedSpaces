import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {useImmerReducer} from 'use-immer';

import localStorageService, {
  DEFAULT_RADIUS_IN_M,
} from '../services/localStorageService';
import log from '../utils/log';

type ProfileReducerData = {
  radiusInM: number | null;
};

const initialReducerData: ProfileReducerData = {
  radiusInM: null,
};

type ProfileContextParams = ProfileReducerData & {
  changeRadius: (value: number) => Promise<void>;
  removeRadius: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextParams>({
  ...initialReducerData,
  changeRadius: async () => {},
  removeRadius: async () => {},
});

type ProfileReducerAction =
  // GET RADIUS
  | {type: 'GET_RADIUS_SUCCESS'; payload: {radiusInM: number}}
  | {type: 'GET_RADIUS_FAIL'; payload: {defaultRadiusInM: number}}

  // CHANGE RADIUS
  | {type: 'CHANGE_RADIUS_SUCCESS'; payload: {radiusInM: number}}

  // REMOVE RADIUS
  | {type: 'REMOVE_RADIUS_SUCCESS'};

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const [data, dispatch] = useImmerReducer<
    ProfileReducerData,
    ProfileReducerAction
  >(profileReducer, initialReducerData);

  const getRadius = useCallback(async () => {
    try {
      const radiusInM = await localStorageService.getRadius();
      dispatch({type: 'GET_RADIUS_SUCCESS', payload: {radiusInM}});
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_RADIUS_FAIL',
        payload: {defaultRadiusInM: DEFAULT_RADIUS_IN_M},
      });
    }
  }, [dispatch]);

  const changeRadius = useCallback(
    async (value: number) => {
      try {
        await localStorageService.setRadius(value);
        dispatch({type: 'CHANGE_RADIUS_SUCCESS', payload: {radiusInM: value}});
      } catch (error) {
        log.error(error);
        throw new Error('Change radius error');
      }
    },
    [dispatch],
  );

  const removeRadius = useCallback(async () => {
    try {
      await localStorageService.removeRadius();
      dispatch({type: 'REMOVE_RADIUS_SUCCESS'});
    } catch (error) {
      log.error(error);
      throw new Error('Remove radius error');
    }
  }, [dispatch]);

  useEffect(() => {
    getRadius();
  }, [getRadius]);

  return (
    <ProfileContext.Provider
      value={{
        radiusInM: data.radiusInM,
        changeRadius,
        removeRadius,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);

function profileReducer(
  draft: ProfileReducerData,
  action: ProfileReducerAction,
) {
  switch (action.type) {
    // GET RADIUS
    case 'GET_RADIUS_SUCCESS': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }

    case 'GET_RADIUS_FAIL': {
      const {defaultRadiusInM} = action.payload;
      draft.radiusInM = defaultRadiusInM;
      break;
    }

    // CHANGE RADIUS
    case 'CHANGE_RADIUS_SUCCESS': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }

    // DELETE RADIUS
    case 'REMOVE_RADIUS_SUCCESS': {
      draft.radiusInM = null;
      break;
    }
  }
}
