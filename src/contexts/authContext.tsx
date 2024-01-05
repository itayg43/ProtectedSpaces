import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {statusCodes} from '@react-native-google-signin/google-signin';
import {useImmerReducer} from 'use-immer';

import authService from '../services/authService';
import type {AuthProvider, RequestStatus} from '../utils/types';
import alert from '../utils/alert';
import log from '../utils/log';

type AuthReducerData = {
  status: RequestStatus;
  isNewSignIn: boolean;
  user: FirebaseAuthTypes.User | null;
};

const initialReducerData: AuthReducerData = {
  status: 'idle',
  isNewSignIn: false,
  user: null,
};

type AuthContextParams = AuthReducerData & {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  ...initialReducerData,
  signIn: async () => {},
  signOut: async () => {},
});

type AuthReducerAction =
  | {type: 'SIGN_IN'}
  | {type: 'SIGN_IN_CANCELLED'}
  | {type: 'SIGN_IN_FAIL'}
  | {type: 'AUTH_STATE_CHANGE'; payload: {user: FirebaseAuthTypes.User | null}};

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [data, dispatch] = useImmerReducer<AuthReducerData, AuthReducerAction>(
    authReducer,
    initialReducerData,
  );

  const handleSignIn = useCallback(
    async (provider: AuthProvider) => {
      try {
        dispatch({type: 'SIGN_IN'});
        await authService.signIn(provider);
      } catch (error: any) {
        if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
          dispatch({type: 'SIGN_IN_CANCELLED'});
          return;
        }

        log.error(error);
        dispatch({type: 'SIGN_IN_FAIL'});
        alert.error('Sign in error');
      }
    },
    [dispatch],
  );

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      log.error(error);
      throw new Error('Sign out error');
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (user: FirebaseAuthTypes.User | null) => {
      dispatch({type: 'AUTH_STATE_CHANGE', payload: {user}});
    },
    [dispatch],
  );

  useEffect(() => {
    const unsub = authService.stateSubscription(handleAuthStateChange);

    return unsub;
  }, [handleAuthStateChange]);

  return (
    <AuthContext.Provider
      value={{
        status: data.status,
        isNewSignIn: data.isNewSignIn,
        user: data.user,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

function authReducer(draft: AuthReducerData, action: AuthReducerAction) {
  switch (action.type) {
    case 'SIGN_IN': {
      draft.status = 'loading';
      draft.isNewSignIn = true;
      break;
    }

    case 'SIGN_IN_CANCELLED': {
      draft.status = 'idle';
      break;
    }

    case 'SIGN_IN_FAIL': {
      draft.status = 'error';
      break;
    }

    case 'AUTH_STATE_CHANGE': {
      const {user} = action.payload;
      draft.status = 'idle';
      draft.user = user;
      break;
    }
  }
}
