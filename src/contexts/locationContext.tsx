import React, {PropsWithChildren, createContext, useContext} from 'react';

import {Location} from '../utils/types';
import useLocation from '../hooks/useLocation';

type LocationContextParams = {
  location: Location | null;
};

const initialContextParams: LocationContextParams = {
  location: null,
};

const LocationContext =
  createContext<LocationContextParams>(initialContextParams);

export const LocationContextProvider = ({children}: PropsWithChildren) => {
  const location = useLocation();

  return (
    <LocationContext.Provider value={{location}}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
