import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import log from '../utils/log';
import type {ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';

type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
});

export const ProtectedSpacesContextProvider = (props: PropsWithChildren) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      s => setProtectedSpaces(s),
      e => log.error(e),
    );

    return unsubscribe;
  }, []);

  const contextValues = useMemo(() => ({protectedSpaces}), [protectedSpaces]);

  return (
    <ProtectedSpacesContext.Provider value={contextValues}>
      {props.children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
