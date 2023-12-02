import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import authService from '../services/authService';
import type {AuthProvider} from '../utils/types';
import errorAlert from '../utils/errorAlert';

type AuthContextParams = {
  isInitializing: boolean;
  user: FirebaseAuthTypes.User | null;
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  isInitializing: true,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthContextProvider = (props: PropsWithChildren) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const signIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error: any) {
      errorAlert.show(error.message);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error: any) {
      errorAlert.show(error.message);
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (u: FirebaseAuthTypes.User | null) => {
      setUser(u);
      if (isInitializing) {
        setIsInitializing(false);
      }
    },
    [isInitializing],
  );

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(handleAuthStateChange);

    return unsubscribe;
  }, [handleAuthStateChange]);

  const contextValues = useMemo(
    () => ({
      isInitializing,
      user,
      signIn,
      signOut,
    }),
    [isInitializing, user, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
