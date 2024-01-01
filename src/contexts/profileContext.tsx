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
import type {RequestStatus, Space} from '../utils/types';
import spacesService from '../services/spacesService';
import {useAuthContext} from './authContext';

type ProfileReducerData = {
  getSpacesStatus: RequestStatus;
  errorMessage: string;
  radiusInM: number | null;
  spaces: Space[];
};

const initialReducerData: ProfileReducerData = {
  getSpacesStatus: 'idle',
  errorMessage: '',
  radiusInM: null,
  spaces: [],
};

type ProfileContextParams = ProfileReducerData & {
  handleRadiusChange: (value: number) => Promise<void>;
  handleRemoveRadius: () => Promise<void>;
  handleGetSpaces: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextParams>({
  ...initialReducerData,
  handleRadiusChange: async () => {},
  handleRemoveRadius: async () => {},
  handleGetSpaces: async () => {},
});

type ProfileReducerAction =
  | {type: 'GET_RADIUS'; payload: {radiusInM: number}}
  | {type: 'CHANGE_RADIUS'; payload: {radiusInM: number}}
  | {type: 'REMOVE_RADIUS'}
  | {type: 'GET_SPACES'}
  | {type: 'GET_SPACES_SUCCESS'; payload: {spaces: Space[]}}
  | {type: 'GET_SPACES_FAIL'; payload: {message: string}};

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const authContext = useAuthContext();

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

  const handleGetSpaces = useCallback(async () => {
    if (authContext.user !== null) {
      try {
        dispatch({type: 'GET_SPACES'});
        const spaces = await spacesService.findByUserId(authContext.user.uid);
        dispatch({type: 'GET_SPACES_SUCCESS', payload: {spaces}});
      } catch (error) {
        log.error(error);
        dispatch({
          type: 'GET_SPACES_FAIL',
          payload: {message: 'Get spaces error'},
        });
      }
    }
  }, [authContext.user, dispatch]);

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
        getSpacesStatus: data.getSpacesStatus,
        errorMessage: data.errorMessage,
        radiusInM: data.radiusInM,
        spaces: data.spaces,
        handleRemoveRadius,
        handleRadiusChange,
        handleGetSpaces,
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

    case 'GET_SPACES': {
      draft.getSpacesStatus = 'loading';
      break;
    }

    case 'GET_SPACES_SUCCESS': {
      const {spaces} = action.payload;
      draft.getSpacesStatus = 'success';
      draft.spaces = spaces;
      break;
    }

    case 'GET_SPACES_FAIL': {
      const {message} = action.payload;
      draft.getSpacesStatus = 'error';
      draft.errorMessage = message;
      break;
    }
  }
}
