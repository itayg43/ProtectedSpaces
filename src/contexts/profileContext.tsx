import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {useImmerReducer} from 'use-immer';

import profileService, {DEFAULT_RADIUS_IN_M} from '../services/profileService';
import log from '../utils/log';

export enum ProfileReducerActionType {
  GET_STORED_DATA = 'GET_STORED_DATA',
  REMOVE_STORED_DATA = 'REMOVE_STORED_DATA',
  RADIUS_CHANGE = 'RADIUS_CHANGE',
}

type ProfileContextParams = {
  radiusInM: number;
  handleRemoveStoredData: () => Promise<void>;
  handleRadiusChange: (value: number) => Promise<void>;
  lastReducerActionType: ProfileReducerActionType | null;
};

const initialContextParams: ProfileContextParams = {
  radiusInM: DEFAULT_RADIUS_IN_M,
  handleRemoveStoredData: async () => {},
  handleRadiusChange: async () => {},
  lastReducerActionType: null,
};

const ProfileContext =
  createContext<ProfileContextParams>(initialContextParams);

type ProfileReducerData = {
  radiusInM: number;
  lastReducerActionType: ProfileReducerActionType | null;
};

const initialReducerData: ProfileReducerData = {
  radiusInM: DEFAULT_RADIUS_IN_M,
  lastReducerActionType: null,
};

type ProfileReducerAction =
  | {
      type: ProfileReducerActionType.GET_STORED_DATA;
      payload: {
        radiusInM: number;
      };
    }
  | {
      type: ProfileReducerActionType.REMOVE_STORED_DATA;
    }
  | {
      type: ProfileReducerActionType.RADIUS_CHANGE;
      payload: {
        radiusInM: number;
      };
    };

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const [data, dispatch] = useImmerReducer<
    ProfileReducerData,
    ProfileReducerAction
  >(profileReducer, initialReducerData);

  const handleGetStoredData = useCallback(async () => {
    try {
      const [radiusInM] = await Promise.all([profileService.getRadius()]);
      dispatch({
        type: ProfileReducerActionType.GET_STORED_DATA,
        payload: {
          radiusInM,
        },
      });
    } catch (error) {
      log.error(error);
    }
  }, [dispatch]);

  const handleRemoveStoredData = useCallback(async () => {
    try {
      await Promise.all([profileService.removeRadius()]);
      dispatch({
        type: ProfileReducerActionType.REMOVE_STORED_DATA,
      });
    } catch (error) {
      log.error(error);
      throw new Error('Remove stored data error');
    }
  }, [dispatch]);

  const handleRadiusChange = useCallback(
    async (value: number) => {
      try {
        await profileService.setRadius(value);
        dispatch({
          type: ProfileReducerActionType.RADIUS_CHANGE,
          payload: {
            radiusInM: value,
          },
        });
      } catch (error) {
        log.error(error);
        throw new Error('Radius change error');
      }
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetStoredData();
  }, [handleGetStoredData]);

  const contextValues = useMemo(
    () => ({
      radiusInM: data.radiusInM,
      handleGetStoredData,
      handleRemoveStoredData,
      handleRadiusChange,
      lastReducerActionType: data.lastReducerActionType,
    }),
    [data, handleGetStoredData, handleRemoveStoredData, handleRadiusChange],
  );

  return (
    <ProfileContext.Provider value={contextValues}>
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
    case ProfileReducerActionType.GET_STORED_DATA: {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      draft.lastReducerActionType = action.type;
      break;
    }

    case ProfileReducerActionType.REMOVE_STORED_DATA: {
      draft.radiusInM = DEFAULT_RADIUS_IN_M;
      draft.lastReducerActionType = action.type;
      break;
    }

    case ProfileReducerActionType.RADIUS_CHANGE: {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      draft.lastReducerActionType = action.type;
      break;
    }
  }
}
