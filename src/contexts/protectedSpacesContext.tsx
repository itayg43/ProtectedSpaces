import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import log from '../utils/log';
import type {AddProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import {useAuthContext} from './authContext';

type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
  handleAddProtectedSpace: (
    formData: AddProtectedSpaceFormData,
  ) => Promise<void>;
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
  handleAddProtectedSpace: async () => {},
});

export const ProtectedSpacesContextProvider = (props: PropsWithChildren) => {
  const {user} = useAuthContext();

  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const handleAddProtectedSpace = useCallback(
    async (formData: AddProtectedSpaceFormData) => {
      if (!user) {
        return;
      }

      try {
        await protectedSpacesService.add(user, formData);
      } catch (error: any) {
        log.error(`Add protected space error: ${error.message}`);
        throw error;
      }
    },
    [user],
  );

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      s => setProtectedSpaces(s),
      e => log.error(e),
    );

    return unsubscribe;
  }, []);

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
      handleAddProtectedSpace,
    }),
    [protectedSpaces, handleAddProtectedSpace],
  );

  return (
    <ProtectedSpacesContext.Provider value={contextValues}>
      {props.children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
