import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert} from 'react-native';

import authService from '../services/authService';
import type {AuthProvider} from '../utils/types';

type AuthContextParams = {
  isUserSignedIn: boolean;
  signIn: (provider: AuthProvider) => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  isUserSignedIn: false,
  signIn: async () => {},
});

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const signIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error) {
      // console.log(error);
      Alert.alert('Error', "We couldn't sign in to your account");
    }
  }, []);

  const contextValues = useMemo(
    () => ({
      isUserSignedIn,
      signIn,
    }),
    [isUserSignedIn, signIn],
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
