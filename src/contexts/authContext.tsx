import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  isNewSignIn: boolean;
  user: FirebaseAuthTypes.User | null;
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const initialContextParams: AuthContextParams = {
  status: 'idle',
  isNewSignIn: false,
  user: null,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
};

const AuthContext = createContext<AuthContextParams>(initialContextParams);

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [isNewSignIn, setIsNewSignIn] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(
    authService.getCurrentUser(),
  );

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      setStatus('loading');
      await authService.signIn(provider);
      setIsNewSignIn(true);
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
      setIsNewSignIn(false);
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

  return (
    <AuthContext.Provider
      value={{
        status,
        isNewSignIn,
        user,
        handleSignIn,
        handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
