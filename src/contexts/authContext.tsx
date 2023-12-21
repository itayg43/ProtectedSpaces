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
import type {AuthProvider, RequestStatus} from '../utils/types';
import alert from '../utils/alert';
import log from '../utils/log';

type AuthContextParams = {
  status: RequestStatus;
  user: FirebaseAuthTypes.User | null;
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams | null>(null);

export const AuthContextProvider = (props: PropsWithChildren) => {
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error) {
      log.error(error);
      alert.error('Sign in error');
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      alert.error('Sign out error');
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (u: FirebaseAuthTypes.User | null) => {
      setUser(u);
      setStatus('idle');
    },
    [],
  );

  useEffect(() => {
    const unsub = authService.stateSubscription(handleAuthStateChange);
    return unsub;
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
