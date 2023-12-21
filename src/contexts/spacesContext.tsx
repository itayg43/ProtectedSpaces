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
  spaces: Space[];
  handleAddSpace: (formData: AddSpaceFormData) => Promise<void>;
  handleFindSpaceById: (id: string) => Space | null;
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
  | {type: 'GET_BY_LOCATION_SUCCESS'; payload: Space[]}
  | {type: 'GET_BY_LOCATION_FAIL'; payload: {message: string}}
  | {type: 'ADD_SUCCESS'; payload: Space}
  | {type: 'DELETE_SUCCESS'; payload: {id: string}};

export const SpacesContextProvider = (props: PropsWithChildren) => {
  const authContext = useAuthContext();
  const locationContext = useLocationContext();
  const {radiusInM} = useProfileContext();

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
        dispatch({
          type: 'ADD_SUCCESS',
          payload: await spacesService.add(authContext.user, formData),
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add space error');
      }
    },
    [authContext, dispatch],
  );

  const handleFindSpaceById = useCallback(
    (id: string) => {
      return data.entities[id];
    },
    [data.entities],
  );

  const handleDeleteSpace = useCallback(
    (id: string) => {
      dispatch({type: 'DELETE_SUCCESS', payload: {id}});
    },
    [dispatch],
  );

  const handleGetSpacesByLocation = useCallback(
    async (l: Location, rInM: number) => {
      try {
        dispatch({
          type: 'GET_BY_LOCATION_SUCCESS',
          payload: await spacesService.findByGeohash(l, rInM),
        });
      } catch (error) {
        log.error(error);
        dispatch({
          type: 'GET_BY_LOCATION_FAIL',
          payload: {message: 'Get by location error'},
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (locationContext?.location) {
      handleGetSpacesByLocation(locationContext.location, radiusInM);
    }
  }, [locationContext, radiusInM, handleGetSpacesByLocation]);

  const contextValues = useMemo(
    () => ({
      status: data.status,
      spaces: Object.values(data.entities),
      handleAddSpace,
      handleFindSpaceById,
      handleDeleteSpace,
    }),
    [data, handleAddSpace, handleFindSpaceById, handleDeleteSpace],
  );

  return (
    <SpacesContext.Provider value={contextValues}>
      {props.children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);

function spacesReducer(data: SpacesReducerData, action: SpacesReducerAction) {
  switch (action.type) {
    case 'GET_BY_LOCATION_SUCCESS': {
      data.status = 'success';
      data.entities = normalize.arrayByKey(action.payload, 'id');
      break;
    }

    case 'GET_BY_LOCATION_FAIL': {
      data.status = 'error';
      data.errorMessage = action.payload.message;
      break;
    }

    case 'ADD_SUCCESS': {
      const s = action.payload;
      data.entities[s.id] = s;
      break;
    }

    case 'DELETE_SUCCESS': {
      delete data.entities[action.payload.id];
      break;
    }
  }
}
