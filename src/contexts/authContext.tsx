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

import log from '../utils/log';
import authService from '../services/authService';
import type {AuthProvider} from '../utils/types';

type AuthContextParams = {
  isUserSignedIn: boolean;
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  isUserSignedIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  const signIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error) {
      log.error(error);
      Alert.alert('Error', "We couldn't sign in to your account");
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      Alert.alert('Error', "We couldn't sign out your account");
    }
  }, []);

  const contextValues = useMemo(
    () => ({
      isUserSignedIn,
      signIn,
      signOut,
    }),
    [isUserSignedIn, signIn, signOut],
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
