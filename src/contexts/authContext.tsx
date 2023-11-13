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
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import log from '../utils/log';
import authService from '../services/authService';
import type {AuthProvider} from '../utils/types';

type AuthContextParams = {
  user: FirebaseAuthTypes.User | null;
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  user: null,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
});

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error) {
      log.error(error);
      Alert.alert('Error', "We couldn't sign in to your account");
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      Alert.alert('Error', "We couldn't sign out your account");
    }
  }, []);

  const contextValues = useMemo(
    () => ({
      user,
      handleSignIn,
      handleSignOut,
    }),
    [user, handleSignIn, handleSignOut],
  );

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(setUser);

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
