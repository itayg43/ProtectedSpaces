import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from 'react';

import type {ProtectedSpace} from '../utils/types';

type ContextParams = {
  protectedSpaces: ProtectedSpace[];
  setProtectedSpaces: React.Dispatch<React.SetStateAction<ProtectedSpace[]>>;
};

const ProtectedSpacesContext = createContext<ContextParams>({
  protectedSpaces: [],
  setProtectedSpaces: () => {},
});

export const ProtectedSpacesProvider = ({children}: PropsWithChildren) => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  const contextValue = useMemo(
    () => ({
      protectedSpaces,
      setProtectedSpaces,
    }),
    [protectedSpaces],
  );

  return (
    <ProtectedSpacesContext.Provider value={contextValue}>
      {children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
