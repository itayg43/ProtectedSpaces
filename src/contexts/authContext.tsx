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

enum AuthReducerActionType {
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_CANCELLED = 'SIGN_IN_CANCELLED',
  SIGN_IN_FAIL = 'SIGN_IN_FAIL',
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE',
}

type AuthReducerData = {
  status: RequestStatus;
  user: FirebaseAuthTypes.User | null;
  lastAction: AuthReducerActionType | null;
};
const initialReducerData: AuthReducerData = {
  status: 'idle',
  user: null,
  lastAction: null,
};

type AuthContextParams = AuthReducerData & {
  handleSignIn: (provider: AuthProvider) => Promise<void>;
  handleSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextParams>({
  ...initialReducerData,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
});

type AuthReducerAction =
  | {
      type: AuthReducerActionType.SIGN_IN;
    }
  | {
      type: AuthReducerActionType.SIGN_IN_CANCELLED;
    }
  | {
      type: AuthReducerActionType.SIGN_IN_FAIL;
    }
  | {
      type: AuthReducerActionType.AUTH_STATE_CHANGE;
      payload: {
        user: FirebaseAuthTypes.User | null;
      };
    };

export const AuthContextProvider = ({children}: PropsWithChildren) => {
  const [data, dispatch] = useImmerReducer<AuthReducerData, AuthReducerAction>(
    authReducer,
    initialReducerData,
  );

  const handleSignIn = useCallback(
    async (provider: AuthProvider) => {
      try {
        dispatch({type: AuthReducerActionType.SIGN_IN});
        await authService.signIn(provider);
      } catch (error: any) {
        if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
          dispatch({type: AuthReducerActionType.SIGN_IN_CANCELLED});
          return;
        }

        log.error(error);
        dispatch({type: AuthReducerActionType.SIGN_IN_FAIL});
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
      dispatch({
        type: AuthReducerActionType.AUTH_STATE_CHANGE,
        payload: {
          user,
        },
      });
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
        user: data.user,
        lastAction: data.lastAction,
        handleSignIn,
        handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

function authReducer(draft: AuthReducerData, action: AuthReducerAction) {
  switch (action.type) {
    case AuthReducerActionType.SIGN_IN: {
      draft.status = 'loading';
      draft.lastAction = action.type;
      break;
    }

    case AuthReducerActionType.SIGN_IN_CANCELLED: {
      draft.status = 'idle';
      draft.lastAction = action.type;
      break;
    }

    case AuthReducerActionType.SIGN_IN_FAIL: {
      draft.status = 'error';
      draft.lastAction = action.type;
      break;
    }

    case AuthReducerActionType.AUTH_STATE_CHANGE: {
      const {user} = action.payload;
      draft.status = 'idle';
      draft.user = user;
      break;
    }
  }
}
