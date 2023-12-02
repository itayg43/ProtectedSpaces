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

type AuthContextStatus = 'idle' | 'initializing';

type AuthContextParams = {
  status: AuthContextStatus;
  user: FirebaseAuthTypes.User | null;
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  status: 'initializing',
  user: null,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
});

export const AuthContextProvider = (props: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthContextStatus>('initializing');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error: any) {
      errorAlert.show(error.message);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error: any) {
      errorAlert.show(error.message);
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (u: FirebaseAuthTypes.User | null) => {
      setUser(u);
      if (status === 'initializing') {
        setStatus('idle');
      }
    },
    [status],
  );

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(handleAuthStateChange);

    return unsubscribe;
  }, [handleAuthStateChange]);

  const contextValues = useMemo(
    () => ({
      status,
      user,
      handleSignIn,
      handleSignOut,
    }),
    [status, user, handleSignIn, handleSignOut],
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
