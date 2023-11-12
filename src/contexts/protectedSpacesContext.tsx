import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';

type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
});

export const ProtectedSpacesContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
    }),
    [protectedSpaces],
  );

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      spaces => setProtectedSpaces(spaces),
      _ => {},
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
