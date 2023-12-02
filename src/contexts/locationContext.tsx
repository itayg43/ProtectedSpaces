import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import type {Location} from '../utils/types';
import useLocation from '../hooks/useLocation';

type LocationContextParams = {
  location: Location | null;
};

const LocationContext = createContext<LocationContextParams>({
  location: null,
});

export const LocationContextProvider = (props: PropsWithChildren) => {
  const location = useLocation();

  const contextValues = useMemo(() => ({location}), [location]);

  return (
    <LocationContext.Provider value={contextValues}>
      {props.children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
