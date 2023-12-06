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
import errorAlert from '../utils/errorAlert';
import log from '../utils/log';

type AuthContextData = {
  initialRequestStatus: RequestStatus;
  user: FirebaseAuthTypes.User | null;
};

const initialData: AuthContextData = {
  initialRequestStatus: 'loading',
  user: null,
};

type AuthContextParams = AuthContextData & {
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  ...initialData,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
});

export const AuthContextProvider = (props: PropsWithChildren) => {
  const [data, setData] = useState<AuthContextData>(initialData);

  const handleSignIn = useCallback(async (provider: AuthProvider) => {
    try {
      await authService.signIn(provider);
    } catch (error) {
      log.error(error);
      errorAlert.show('Sign in error');
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      errorAlert.show('Sign out error');
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (u: FirebaseAuthTypes.User | null) => {
      setData(currentData => ({
        user: u,
        initialRequestStatus:
          currentData.initialRequestStatus === 'loading'
            ? 'idle'
            : currentData.initialRequestStatus,
      }));
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = authService.stateSubscription(handleAuthStateChange);

    return unsubscribe;
  }, [handleAuthStateChange]);

  const contextValues = useMemo(
    () => ({
      ...data,
      handleSignIn,
      handleSignOut,
    }),
    [data, handleSignIn, handleSignOut],
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
