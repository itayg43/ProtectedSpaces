import React, {
  useContext,
  useMemo,
  useEffect,
  PropsWithChildren,
  createContext,
  useState,
} from 'react';

import authService from '../services/authService';

type ContextParams = {
  isUserSignedIn: boolean;
};

const AuthContext = createContext<ContextParams>({
  isUserSignedIn: false,
});

export const AuthProvider = ({children}: PropsWithChildren) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const contextValue = useMemo(
    () => ({
      isUserSignedIn,
    }),
    [isUserSignedIn],
  );

  useEffect(() => {
    const authUnsubscribe = authService.stateSubscription(user =>
      setIsUserSignedIn(!!user),
    );

    return authUnsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
