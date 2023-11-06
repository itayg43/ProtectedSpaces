import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
  useEffect,
} from 'react';
import {Alert} from 'react-native';

import type {ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';

type ContextParams = {
  protectedSpaces: ProtectedSpace[];
};

const ProtectedSpacesContext = createContext<ContextParams>({
  protectedSpaces: [],
});

export const ProtectedSpacesProvider = ({children}: PropsWithChildren) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const contextValue = useMemo(
    () => ({
      protectedSpaces,
    }),
    [protectedSpaces],
  );

  useEffect(() => {
    const protectedSpacesUnsubscribe =
      protectedSpacesService.collectionSubscription(
        spaces => setProtectedSpaces(spaces),
        error => Alert.alert('Error', error.message),
      );

    return protectedSpacesUnsubscribe;
  }, []);

  return (
    <ProtectedSpacesContext.Provider value={contextValue}>
      {children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
