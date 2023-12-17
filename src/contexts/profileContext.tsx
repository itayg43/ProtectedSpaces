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
};

const ProfileContext = createContext<ProfileContextParams>({
  radiusInM: DEFAULT_RADIUS_IN_M,
  handleRadiusChange: async () => {},
});

export const ProfileContextProvider = (props: PropsWithChildren) => {
  const [radiusInM, setRadiusInM] = useState(DEFAULT_RADIUS_IN_M);

  const handleRadiusChange = useCallback(async (value: number) => {
    try {
      await profileService.setRadius(value);
      setRadiusInM(value);
    } catch (error) {
      log.error(error);
    }
  }, []);

  const handleGetStoredData = useCallback(async () => {
    try {
      setRadiusInM(await profileService.getRadius());
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
    }),
    [radiusInM, handleRadiusChange],
  );

  return (
    <ProfileContext.Provider value={contextValues}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
