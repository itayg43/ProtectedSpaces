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

type SpacesContextParams = {
  status: RequestStatus;
  errorMessage: string;
  spaces: Space[];
  handleAddSpace: (formData: AddSpaceFormData) => Promise<void>;
  handleDeleteSpace: (id: string) => void;
};

const SpacesContext = createContext<SpacesContextParams | null>(null);

type SpacesReducerData = {
  status: RequestStatus;
  errorMessage: string;
  entities: {
    [id: string]: Space;
  };
};

const initialReducerData: SpacesReducerData = {
  status: 'loading',
  errorMessage: '',
  entities: {},
};

type SpacesReducerAction =
  | {
      type: 'GET_BY_LOCATION_SUCCESS';
      payload: {
        spaces: Space[];
      };
    }
  | {
      type: 'GET_BY_LOCATION_FAIL';
      payload: {
        message: string;
      };
    }
  | {
      type: 'ADD_SUCCESS';
      payload: {
        space: Space;
      };
    }
  | {
      type: 'DELETE';
      payload: {
        id: string;
      };
    };

export const SpacesContextProvider = (props: PropsWithChildren) => {
  const authContext = useAuthContext();
  const locationContext = useLocationContext();
  const profileContext = useProfileContext();

  const [data, dispatch] = useImmerReducer<
    SpacesReducerData,
    SpacesReducerAction
  >(spacesReducer, initialReducerData);

  const handleAddSpace = useCallback(
    async (formData: AddSpaceFormData) => {
      if (!authContext?.user) {
        return;
      }

      try {
        const space = await spacesService.add(authContext.user, formData);
        dispatch({
          type: 'ADD_SUCCESS',
          payload: {
            space,
          },
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add space error');
      }
    },
    [authContext?.user, dispatch],
  );

  const handleDeleteSpace = useCallback(
    (id: string) => {
      if (id in data.entities) {
        dispatch({
          type: 'DELETE',
          payload: {
            id,
          },
        });
      }
    },
    [data.entities, dispatch],
  );

  const handleGetSpacesByLocation = useCallback(
    async (l: Location, rInM: number) => {
      try {
        const spaces = await spacesService.findByGeohash(l, rInM);
        dispatch({
          type: 'GET_BY_LOCATION_SUCCESS',
          payload: {
            spaces,
          },
        });
      } catch (error) {
        log.error(error);
        dispatch({
          type: 'GET_BY_LOCATION_FAIL',
          payload: {
            message: 'Get by location error',
          },
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (locationContext.location && profileContext?.radiusInM) {
      handleGetSpacesByLocation(
        locationContext.location,
        profileContext.radiusInM,
      );
    }
  }, [
    locationContext.location,
    profileContext?.radiusInM,
    handleGetSpacesByLocation,
  ]);

  const contextValues = useMemo(
    () => ({
      status: data.status,
      errorMessage: data.errorMessage,
      spaces: Object.values(data.entities),
      handleAddSpace,
      handleDeleteSpace,
    }),
    [data, handleAddSpace, handleDeleteSpace],
  );

  return (
    <SpacesContext.Provider value={contextValues}>
      {props.children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);

function spacesReducer(draft: SpacesReducerData, action: SpacesReducerAction) {
  switch (action.type) {
    case 'GET_BY_LOCATION_SUCCESS': {
      const {spaces} = action.payload;
      draft.status = 'success';
      draft.entities = normalize.arrayByUniqueKey(spaces, 'id');
      break;
    }

    case 'GET_BY_LOCATION_FAIL': {
      const {message} = action.payload;
      draft.status = 'error';
      draft.errorMessage = message;
      break;
    }

    case 'ADD_SUCCESS': {
      const {space} = action.payload;
      draft.entities[space.id] = space;
      break;
    }

    case 'DELETE': {
      const {id} = action.payload;
      delete draft.entities[id];
      break;
    }
  }
}
