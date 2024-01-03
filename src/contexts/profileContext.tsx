import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {useImmerReducer} from 'use-immer';

import profileService, {DEFAULT_RADIUS_IN_M} from '../services/profileService';
import log from '../utils/log';
import type {LocalStoredSpace, RequestStatus} from '../utils/types';
import spacesService from '../services/spacesService';
import {useAuthContext} from './authContext';

type ProfileReducerData = {
  getSpacesStatus: RequestStatus;
  errorMessage: string;
  radiusInM: number | null;
  spaces: LocalStoredSpace[] | null;
};

const initialReducerData: ProfileReducerData = {
  getSpacesStatus: 'idle',
  errorMessage: '',
  radiusInM: null,
  spaces: null,
};

type ProfileContextParams = ProfileReducerData & {
  handleRadiusChange: (value: number) => Promise<void>;
  handleGetSpaces: () => Promise<void>;
  handleRemoveStoredData: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextParams>({
  ...initialReducerData,
  handleRadiusChange: async () => {},
  handleGetSpaces: async () => {},
  handleRemoveStoredData: async () => {},
});

type ProfileReducerAction =
  | {type: 'GET_RADIUS_SUCCESS'; payload: {radiusInM: number}}
  | {type: 'GET_RADIUS_FAIL'; payload: {defaultRadiusInM: number}}
  | {type: 'CHANGE_RADIUS'; payload: {radiusInM: number}}
  | {type: 'GET_SPACES_SUCCESS'; payload: {spaces: LocalStoredSpace[]}}
  | {type: 'GET_SPACES_FAIL'; payload: {message: string}}
  | {type: 'REMOVE_STORED_DATA'};

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const authContext = useAuthContext();

  const [data, dispatch] = useImmerReducer<
    ProfileReducerData,
    ProfileReducerAction
  >(profileReducer, initialReducerData);

  const handleGetRadius = useCallback(async () => {
    try {
      const radiusInM = await profileService.getRadius();
      dispatch({type: 'GET_RADIUS_SUCCESS', payload: {radiusInM}});
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_RADIUS_FAIL',
        payload: {defaultRadiusInM: DEFAULT_RADIUS_IN_M},
      });
    }
  }, [dispatch]);

  const handleGetSpaces = useCallback(async () => {
    if (authContext.user !== null) {
      try {
        let spaces: LocalStoredSpace[];

        if (authContext.isNewSignIn === true) {
          const s = await spacesService.findByUserId(authContext.user.uid);

          spaces = s.map(currS => ({
            id: currS.id,
            address: currS.address,
            createdAt: currS.createdAt.toMillis(),
          }));

          await profileService.setSpaces(spaces);
        } else {
          spaces = await profileService.getSpaces();
        }

        dispatch({
          type: 'GET_SPACES_SUCCESS',
          payload: {spaces},
        });
      } catch (error) {
        log.error(error);
        dispatch({
          type: 'GET_SPACES_FAIL',
          payload: {message: 'Get spaces error'},
        });
      }
    }
  }, [authContext.user, authContext.isNewSignIn, dispatch]);

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

  const handleRemoveStoredData = useCallback(async () => {
    try {
      await Promise.all([
        profileService.removeRadius(),
        profileService.removeSpaces(),
      ]);
      dispatch({type: 'REMOVE_STORED_DATA'});
    } catch (error) {
      log.error(error);
      throw new Error('Remove stored data error');
    }
  }, [dispatch]);

  const handleGetStoredData = useCallback(async () => {
    await Promise.all([handleGetRadius(), handleGetSpaces()]);
  }, [handleGetRadius, handleGetSpaces]);

  useEffect(() => {
    handleGetStoredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        getSpacesStatus: data.getSpacesStatus,
        errorMessage: data.errorMessage,
        radiusInM: data.radiusInM,
        spaces: data.spaces,
        handleRadiusChange,
        handleGetSpaces,
        handleRemoveStoredData,
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

    case 'CHANGE_RADIUS': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
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

    case 'REMOVE_STORED_DATA': {
      return initialReducerData;
    }
  }
}
