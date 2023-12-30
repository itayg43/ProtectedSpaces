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
import {statusCodes} from '@react-native-google-signin/google-signin';

type AuthContextParams = {
  status: RequestStatus;
  user: FirebaseAuthTypes.User | null;
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const initialContextParams: AuthContextParams = {
  status: 'idle',
  user: null,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
};

const AuthContext = createContext<AuthContextParams>(initialContextParams);

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(
    authService.getCurrentUser(),
  );

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      setStatus('loading');
      await authService.signIn(provider);
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        setStatus('idle');
        return;
      }

      log.error(error);
      setStatus('error');
      alert.error('Sign in error');
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      throw new Error('Sign out error');
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
