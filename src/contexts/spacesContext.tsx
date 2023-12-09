import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {AddSpaceFormData, Location, Space} from '../utils/types';
import {useLocationContext} from './locationContext';
import spacesService from '../services/spacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';

type SpacesContextParams = {
  spaces: Space[];
  handleAddSpace: (formData: AddSpaceFormData) => Promise<void>;
  handleFindSpaceById: (id: string) => Space | null;
};

const SpacesContext = createContext<SpacesContextParams>({
  spaces: [],
  handleAddSpace: async () => {},
  handleFindSpaceById: () => null,
});

export const SpacesContextProvider = (props: PropsWithChildren) => {
  const {user} = useAuthContext();
  const {location} = useLocationContext();

  const [spaces, setSpaces] = useState<Space[]>([]);

  const handleAddSpace = useCallback(
    async (formData: AddSpaceFormData) => {
      if (!user) {
        return;
      }

      try {
        await spacesService.add(user, formData);
      } catch (error) {
        log.error(error);
        throw new Error('Add space error');
      }
    },
    [user],
  );

  const handleFindSpaceById = useCallback(
    (id: string) => {
      return spaces.find(s => s.id === id) ?? null;
    },
    [spaces],
  );

  const handleGetSpacesByLocation = useCallback(async (l: Location) => {
    try {
      setSpaces(await spacesService.findByGeohash(l));
    } catch (error) {
      log.error(error);
    }
  }, []);

  useEffect(() => {
    if (location) {
      handleGetSpacesByLocation(location);
    }
  }, [location, handleGetSpacesByLocation]);

  const contextValues = useMemo(
    () => ({
      spaces,
      handleAddSpace,
      handleFindSpaceById,
    }),
    [spaces, handleAddSpace, handleFindSpaceById],
  );

  return (
    <SpacesContext.Provider value={contextValues}>
      {props.children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);
