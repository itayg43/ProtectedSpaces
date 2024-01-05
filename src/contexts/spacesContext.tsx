import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {useImmerReducer} from 'use-immer';

import type {
  AddSpaceFormData,
  UserSpace,
  Location,
  RequestStatus,
  Space,
} from '../utils/types';
import {useLocationContext} from './locationContext';
import spacesService from '../services/spacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';
import {useProfileContext} from './profileContext';
import normalize from '../utils/normalize';
import localStorageService from '../services/localStorageService';

type SpacesReducerData = {
  getSpacesStatus: RequestStatus;
  getUserSpacesStatus: RequestStatus;
  errorMessage: string;
  spacesEntities: {
    [id: string]: Space;
  };
  userSpacesEntities: {
    [id: string]: UserSpace;
  };
};

const initialReducerData: SpacesReducerData = {
  getSpacesStatus: 'loading',
  getUserSpacesStatus: 'idle',
  errorMessage: '',
  spacesEntities: {},
  userSpacesEntities: {},
};

type SpacesContextParams = Omit<
  SpacesReducerData,
  'spacesEntities' | 'userSpacesEntities'
> & {
  spaces: Space[];
  userSpaces: UserSpace[];
} & {
  getUserSpaces: () => Promise<void>;
  removeUserSpaces: () => Promise<void>;
  addSpace: (formData: AddSpaceFormData) => Promise<void>;
  deleteSpace: (id: string) => Promise<void>;
};

const SpacesContext = createContext<SpacesContextParams>({
  getSpacesStatus: initialReducerData.getSpacesStatus,
  getUserSpacesStatus: initialReducerData.getUserSpacesStatus,
  errorMessage: initialReducerData.errorMessage,
  spaces: [],
  userSpaces: [],
  getUserSpaces: async () => {},
  removeUserSpaces: async () => {},
  addSpace: async () => {},
  deleteSpace: async () => {},
});

type SpacesReducerAction =
  // GET SPACES
  | {type: 'GET_SPACES_SUCCESS'; payload: {spaces: Space[]}}
  | {type: 'GET_SPACES_FAIL'; payload: {message: string}}

  // GET USER SPACES
  | {type: 'GET_USER_SPACES'}
  | {type: 'GET_USER_SPACES_SUCCESS'; payload: {userSpaces: UserSpace[]}}
  | {type: 'GET_USER_SPACES_FAIL'; payload: {message: string}}

  // REMOVE USER SPACES
  | {type: 'REMOVE_USERS_SPACES'}

  // ADD SPACE
  | {type: 'ADD_SPACE_SUCCESS'; payload: {space: Space}}

  // DELETE SPACE
  | {type: 'DELETE_SPACE_SUCCESS'; payload: {id: string}};

export const SpacesContextProvider = ({children}: PropsWithChildren) => {
  const authContext = useAuthContext();
  const locationContext = useLocationContext();
  const profileContext = useProfileContext();

  const [data, dispatch] = useImmerReducer<
    SpacesReducerData,
    SpacesReducerAction
  >(spacesReducer, initialReducerData);

  const spaces = useMemo(() => {
    return Object.values(data.spacesEntities);
  }, [data.spacesEntities]);

  const userSpaces = useMemo(() => {
    return Object.values(data.userSpacesEntities);
  }, [data.userSpacesEntities]);

  const getSpaces = useCallback(
    async (location: Location, radiusInM: number) => {
      try {
        const s = await spacesService.findByGeohash(location, radiusInM);
        dispatch({type: 'GET_SPACES_SUCCESS', payload: {spaces: s}});
      } catch (error) {
        log.error(error);
        dispatch({
          type: 'GET_SPACES_FAIL',
          payload: {message: 'Get by location error'},
        });
      }
    },
    [dispatch],
  );

  const getUserSpaces = useCallback(async () => {
    if (authContext.user === null) {
      return;
    }

    try {
      dispatch({type: 'GET_USER_SPACES'});

      let uSpaces: UserSpace[];

      if (authContext.isNewSignIn === true) {
        const values = await spacesService.findByUserId(authContext.user.uid);
        uSpaces = values.map(v => convertSpaceToUserSpace(v));
        await localStorageService.setUserSpaces(uSpaces);
      } else {
        uSpaces = await localStorageService.getUserSpaces();
      }

      dispatch({
        type: 'GET_USER_SPACES_SUCCESS',
        payload: {userSpaces: uSpaces},
      });
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_USER_SPACES_FAIL',
        payload: {message: 'Get user spaces error'},
      });
    }
  }, [authContext.user, authContext.isNewSignIn, dispatch]);

  const removeUserSpaces = useCallback(async () => {
    try {
      await localStorageService.removeUserSpaces();
      dispatch({type: 'REMOVE_USERS_SPACES'});
    } catch (error) {
      log.error(error);
      throw new Error('Remove users spaces error');
    }
  }, [dispatch]);

  const addSpace = useCallback(
    async (formData: AddSpaceFormData) => {
      if (authContext.user === null) {
        return;
      }

      try {
        const space = await spacesService.add(authContext.user, formData);
        await localStorageService.addUserSpace(space);
        dispatch({type: 'ADD_SPACE_SUCCESS', payload: {space}});
      } catch (error) {
        log.error(error);
        throw new Error('Add space error');
      }
    },
    [authContext.user, dispatch],
  );

  const deleteSpace = useCallback(
    async (id: string) => {
      try {
        await spacesService.deleteByIdIncludeComments(id);
        await localStorageService.deleteUserSpace(id);
        dispatch({type: 'DELETE_SPACE_SUCCESS', payload: {id}});
      } catch (error) {
        log.error(error);
        throw new Error('Delete space error');
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (
      locationContext.location !== null &&
      profileContext.radiusInM !== null
    ) {
      getSpaces(locationContext.location, profileContext.radiusInM);
    }
  }, [locationContext.location, profileContext.radiusInM, getSpaces]);

  return (
    <SpacesContext.Provider
      value={{
        getSpacesStatus: data.getSpacesStatus,
        getUserSpacesStatus: data.getUserSpacesStatus,
        errorMessage: data.errorMessage,
        spaces,
        userSpaces,
        getUserSpaces,
        removeUserSpaces,
        addSpace,
        deleteSpace,
      }}>
      {children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);

function spacesReducer(draft: SpacesReducerData, action: SpacesReducerAction) {
  switch (action.type) {
    // GET SPACES
    case 'GET_SPACES_SUCCESS': {
      const {spaces} = action.payload;
      draft.getSpacesStatus = 'success';
      draft.spacesEntities = normalize.arrayByUniqueKey(spaces, 'id');
      break;
    }

    case 'GET_SPACES_FAIL': {
      const {message} = action.payload;
      draft.getSpacesStatus = 'error';
      draft.errorMessage = message;
      break;
    }

    // GET USER SPACES
    case 'GET_USER_SPACES': {
      draft.getUserSpacesStatus = 'loading';
      break;
    }

    case 'GET_USER_SPACES_SUCCESS': {
      const {userSpaces} = action.payload;
      draft.getUserSpacesStatus = 'success';
      draft.userSpacesEntities = normalize.arrayByUniqueKey(userSpaces, 'id');
      break;
    }

    case 'GET_USER_SPACES_FAIL': {
      const {message} = action.payload;
      draft.getUserSpacesStatus = 'error';
      draft.errorMessage = message;
      break;
    }

    case 'REMOVE_USERS_SPACES': {
      draft.userSpacesEntities = {};
      break;
    }

    // ADD SPACE
    case 'ADD_SPACE_SUCCESS': {
      const {space} = action.payload;
      draft.spacesEntities[space.id] = space;
      draft.userSpacesEntities[space.id] = convertSpaceToUserSpace(space);
      break;
    }

    // DELETE SPACE
    case 'DELETE_SPACE_SUCCESS': {
      const {id} = action.payload;

      if (id in draft.spacesEntities) {
        delete draft.spacesEntities[id];
      }

      delete draft.userSpacesEntities[id];
      break;
    }
  }
}

export function convertSpaceToUserSpace(s: Space): UserSpace {
  return {
    id: s.id,
    address: s.address,
    createdAt: s.createdAt.toMillis(),
  };
}
