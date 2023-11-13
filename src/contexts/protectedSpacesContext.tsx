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

export const ProtectedSpacesContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const handleAddProtectedSpace = useCallback(
    async (formData: AddProtectedSpaceFormData) => {
      try {
        await protectedSpacesService.add(formData);
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add the protected space");
      }
    },
    [],
  );

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
      handleAddProtectedSpace,
    }),
    [protectedSpaces, handleAddProtectedSpace],
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
