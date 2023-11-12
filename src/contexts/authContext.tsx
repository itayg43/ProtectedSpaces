import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import authService from '../services/authService';

type AuthContextParams = {
  isUserSignedIn: boolean;
};

const AuthContext = createContext<AuthContextParams>({
  isUserSignedIn: false,
});

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const contextValues = useMemo(
    () => ({
      isUserSignedIn,
    }),
    [isUserSignedIn],
  );

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(user =>
      setIsUserSignedIn(!!user),
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
