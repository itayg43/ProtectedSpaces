import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {AddProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';

type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
  handleAddProtectedSpace: (
    formData: AddProtectedSpaceFormData,
  ) => Promise<void>;
  getProtectedSpaceById: (id: string) => ProtectedSpace | null;
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
  handleAddProtectedSpace: async () => {},
  getProtectedSpaceById: () => null,
});

export const ProtectedSpacesContextProvider = ({
  children,
}: PropsWithChildren) => {
  const {user} = useAuthContext();
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const handleAddProtectedSpace = useCallback(
    async (formData: AddProtectedSpaceFormData) => {
      try {
        await protectedSpacesService.add(user, formData);
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add the protected space");
      }
    },
    [user],
  );

  const getProtectedSpaceById = useCallback(
    (id: string) => {
      return protectedSpaces.find(p => p.id === id) ?? null;
    },
    [protectedSpaces],
  );

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
      handleAddProtectedSpace,
      getProtectedSpaceById,
    }),
    [protectedSpaces, handleAddProtectedSpace, getProtectedSpaceById],
  );

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      spaces => setProtectedSpaces(spaces),
      error => log.error(error),
    );

    return unsubscribe;
  }, []);

  return (
    <ProtectedSpacesContext.Provider value={contextValues}>
      {children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
