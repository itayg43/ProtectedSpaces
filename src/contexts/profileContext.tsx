import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import profileService, {DEFAULT_RADIUS_IN_M} from '../services/profileService';
import log from '../utils/log';

type ProfileContextParams = {
  radiusInM: number;
  handleRadiusChange: (value: number) => Promise<void>;
  handleRemoveStoredData: () => Promise<void>;
};

const initialContextParams: ProfileContextParams = {
  radiusInM: DEFAULT_RADIUS_IN_M,
  handleRadiusChange: async () => {},
  handleRemoveStoredData: async () => {},
};

const ProfileContext =
  createContext<ProfileContextParams>(initialContextParams);

export const ProfileContextProvider = ({children}: PropsWithChildren) => {
  const [radiusInM, setRadiusInM] = useState(DEFAULT_RADIUS_IN_M);

  const handleRadiusChange = useCallback(async (value: number) => {
    try {
      await profileService.setRadius(value);
      setRadiusInM(value);
    } catch (error) {
      log.error(error);
    }
  }, []);

  const handleRemoveStoredData = useCallback(async () => {
    try {
      await Promise.all([profileService.removeRadius()]);
    } catch (error) {
      log.error(error);
      throw new Error('Remove stored data error');
    }
  }, []);

  const handleGetStoredData = useCallback(async () => {
    try {
      const [r] = await Promise.all([profileService.getRadius()]);
      setRadiusInM(r);
    } catch (error) {
      log.error(error);
    }
  }, []);

  useEffect(() => {
    handleGetStoredData();
  }, [handleGetStoredData]);

  const contextValues = useMemo(
    () => ({
      radiusInM,
      handleRadiusChange,
      handleRemoveStoredData,
    }),
    [radiusInM, handleRadiusChange, handleRemoveStoredData],
  );

  return (
    <ProfileContext.Provider value={contextValues}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
