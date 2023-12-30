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

type ProfileContextParams = {
  radiusInM: number;
  handleRemoveStoredData: () => Promise<void>;
  handleRadiusChange: (value: number) => Promise<void>;
};

const initialContextParams: ProfileContextParams = {
  radiusInM: DEFAULT_RADIUS_IN_M,
  handleRemoveStoredData: async () => {},
  handleRadiusChange: async () => {},
};

const ProfileContext =
  createContext<ProfileContextParams>(initialContextParams);

type ProfileReducerData = {
  radiusInM: number;
};

const initialReducerData: ProfileReducerData = {
  radiusInM: DEFAULT_RADIUS_IN_M,
};

type ProfileReducerAction =
  | {
      type: 'GET_STORED_DATA';
      payload: {
        radiusInM: number;
      };
    }
  | {
      type: 'REMOVE_STORED_DATA';
    }
  | {
      type: 'RADIUS_CHANGE';
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
        type: 'GET_STORED_DATA',
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
        type: 'REMOVE_STORED_DATA',
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
          type: 'RADIUS_CHANGE',
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
    case 'GET_STORED_DATA': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }

    case 'REMOVE_STORED_DATA': {
      return initialReducerData;
    }

    case 'RADIUS_CHANGE': {
      const {radiusInM} = action.payload;
      draft.radiusInM = radiusInM;
      break;
    }
  }
}
