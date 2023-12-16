import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const DEFAULT_RADIUS_IN_M = 300;

type ProfileContextParams = {
  radiusInM: number;
  handleRadiusChange: (value: number) => void;
};

const ProfileContext = createContext<ProfileContextParams>({
  radiusInM: 0,
  handleRadiusChange: () => {},
});

export const ProfileContextProvider = (props: PropsWithChildren) => {
  const [radiusInM, setRadiusInM] = useState(DEFAULT_RADIUS_IN_M);

  const handleRadiusChange = useCallback((value: number) => {
    setRadiusInM(value);
  }, []);

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
