import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {useImmerReducer} from 'use-immer';

import profileService from '../services/profileService';
import log from '../utils/log';

type ProfileReducerData = {
  radiusInM: number | null;
};

const initialReducerData: ProfileReducerData = {
  radiusInM: null,
};

type ProfileContextParams = ProfileReducerData & {
  handleRadiusChange: (value: number) => Promise<void>;
  handleRemoveRadius: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextParams>({
  ...initialReducerData,
  handleRadiusChange: async () => {},
  handleRemoveRadius: async () => {},
});

type ProfileReducerAction =
  | {type: 'GET_RADIUS'; payload: {radiusInM: number}}
  | {type: 'CHANGE_RADIUS'; payload: {radiusInM: number}}
  | {type: 'REMOVE_RADIUS'};

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const [data, dispatch] = useImmerReducer<
    ProfileReducerData,
    ProfileReducerAction
  >(profileReducer, initialReducerData);

  const handleGetRadius = useCallback(async () => {
    try {
      const radiusInM = await profileService.getRadius();
      dispatch({type: 'GET_RADIUS', payload: {radiusInM}});
    } catch (error) {
      log.error(error);
    }
  }, [dispatch]);

  const handleRadiusChange = useCallback(
    async (value: number) => {
      try {
        await profileService.setRadius(value);
        dispatch({type: 'CHANGE_RADIUS', payload: {radiusInM: value}});
      } catch (error) {
        log.error(error);
        throw new Error('Radius change error');
      }
    },
    [dispatch],
  );

  const handleRemoveRadius = useCallback(async () => {
    try {
      await profileService.removeRadius();
      dispatch({type: 'REMOVE_RADIUS'});
    } catch (error) {
      log.error(error);
      throw new Error('Remove stored data error');
    }
  }, [dispatch]);

  useEffect(() => {
    handleGetRadius();
  }, [handleGetRadius]);

  return (
    <ProfileContext.Provider
      value={{
        radiusInM: data.radiusInM,
        handleRemoveRadius,
        handleRadiusChange,
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
    case 'GET_RADIUS': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }

    case 'CHANGE_RADIUS': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }

    case 'REMOVE_RADIUS': {
      draft.radiusInM = null;
      break;
    }
  }
}
