import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

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

const SpacesContext = createContext<SpacesContextParams>({
  status: 'loading',
  spaces: [],
  handleAddSpace: async () => {},
  handleFindSpaceById: () => null,
  handleDeleteSpace: () => {},
});

export const SpacesContextProvider = (props: PropsWithChildren) => {
  const {user} = useAuthContext();
  const {location} = useLocationContext();
  const {radiusInM} = useProfileContext();

  const [{status, entities}, dispatch] = useReducer(spacesReducer, {
    status: 'loading',
    entities: {},
  });

  const handleAddSpace = useCallback(
    async (formData: AddSpaceFormData) => {
      if (!user) {
        return;
      }

      try {
        dispatch({
          type: 'ADD',
          payload: await spacesService.add(user, formData),
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add space error');
      }
    },
    [user],
  );

  const handleFindSpaceById = useCallback(
    (id: string) => {
      return entities[id];
    },
    [entities],
  );

  const handleDeleteSpace = useCallback((id: string) => {
    dispatch({type: 'DELETE', payload: id});
  }, []);

  const handleGetSpacesByLocation = useCallback(
    async (l: Location, rInM: number) => {
      try {
        dispatch({
          type: 'SET',
          payload: await spacesService.findByGeohash(l, rInM),
        });
      } catch (error) {
        log.error(error);
      }
    },
    [],
  );

  useEffect(() => {
    if (location) {
      handleGetSpacesByLocation(location, radiusInM);
    }
  }, [location, radiusInM, handleGetSpacesByLocation]);

  const contextValues = useMemo(
    () => ({
      status,
      spaces: Object.values(entities),
      handleAddSpace,
      handleFindSpaceById,
      handleDeleteSpace,
    }),
    [status, entities, handleAddSpace, handleFindSpaceById, handleDeleteSpace],
  );

  return (
    <SpacesContext.Provider value={contextValues}>
      {props.children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);

type SpacesReducerData = {
  status: RequestStatus;
  entities: {
    [id: string]: Space;
  };
};

type SpacesReducerAction = {
  type: 'SET' | 'ADD' | 'DELETE';
  payload: Space[] | Space | string;
};

function spacesReducer(
  data: SpacesReducerData,
  action: SpacesReducerAction,
): SpacesReducerData {
  switch (action.type) {
    case 'SET': {
      return {
        status: data.status === 'loading' ? 'idle' : data.status,
        entities: normalize.arrayByKey(action.payload as Space[], 'id'),
      };
    }

    case 'ADD': {
      const s = action.payload as Space;
      return {
        status: data.status,
        entities: {
          ...data.entities,
          [s.id]: s,
        },
      };
    }

    case 'DELETE': {
      delete data.entities[action.payload as string];
      return {
        status: data.status,
        entities: {
          ...data.entities,
        },
      };
    }
  }
}
