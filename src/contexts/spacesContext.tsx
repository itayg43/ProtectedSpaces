import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {AddSpaceFormData, Location, RequestStatus, Space} from '../utils/types';
import {useLocationContext} from './locationContext';
import spacesService from '../services/spacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';
import {useProfileContext} from './profileContext';

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

  const [status, setStatus] = useState<RequestStatus>('loading');

  const [spaces, setSpaces] = useState<Space[]>([]);

  const handleAddSpace = useCallback(
    async (formData: AddSpaceFormData) => {
      if (!user) {
        return;
      }

      try {
        const space = await spacesService.add(user, formData);
        setSpaces(currSpaces => [space, ...currSpaces]);
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

  const handleDeleteSpace = useCallback((id: string) => {
    setSpaces(currSpaces => currSpaces.filter(s => s.id !== id));
  }, []);

  const handleGetSpacesByLocation = useCallback(
    async (l: Location, rInM: number) => {
      try {
        setSpaces(await spacesService.findByGeohash(l, rInM));
        if (status === 'loading') {
          setStatus('idle');
        }
      } catch (error) {
        log.error(error);
      }
    },
    [status],
  );

  useEffect(() => {
    if (location) {
      handleGetSpacesByLocation(location, radiusInM);
    }
  }, [location, radiusInM, handleGetSpacesByLocation]);

  const contextValues = useMemo(
    () => ({
      status,
      spaces,
      handleAddSpace,
      handleFindSpaceById,
      handleDeleteSpace,
    }),
    [status, spaces, handleAddSpace, handleFindSpaceById, handleDeleteSpace],
  );

  return (
    <SpacesContext.Provider value={contextValues}>
      {props.children}
    </SpacesContext.Provider>
  );
};

export const useSpacesContext = () => useContext(SpacesContext);
