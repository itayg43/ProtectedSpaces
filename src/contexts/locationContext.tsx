import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import type {Location} from '../utils/types';
import useLocation from '../hooks/useLocation';

const LocationContext = createContext<Location | null>(null);

export const LocationContextProvider = ({children}: PropsWithChildren) => {
  const location = useLocation();

  const contextValues = useMemo(() => location, [location]);

  return (
    <LocationContext.Provider value={contextValues}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
