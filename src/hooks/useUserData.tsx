import {useCallback, useEffect, useState} from 'react';
import {Comment, ProtectedSpace} from '../utils/types';

import protectedSpacesService from '../services/protectedSpacesService';
import commentsService from '../services/commentsService';
import log from '../utils/log';
import {useAuthContext} from '../contexts/authContext';
import type {RequestStatus} from '../utils/types';

type UserDataParams = {
  initialRequestStatus: RequestStatus;
  protectedSpaces: ProtectedSpace[];
  comments: Comment[];
};

const initialState: UserDataParams = {
  initialRequestStatus: 'loading',
  protectedSpaces: [],
  comments: [],
};

const useUserData = () => {
  const {user} = useAuthContext();

  const [data, setData] = useState<UserDataParams>(initialState);

  const handleGetData = useCallback(async (uid: string) => {
    try {
      const [s, c] = await Promise.all([
        protectedSpacesService.findByUserId(uid),
        commentsService.findByUserId(uid),
      ]);
      setData({
        initialRequestStatus: 'idle',
        protectedSpaces: s,
        comments: c,
      });
    } catch (error) {
      log.error(error);
      setData(currentData => ({
        ...currentData,
        initialRequestStatus: 'error',
      }));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    handleGetData(user.uid);
  }, [user, handleGetData]);

  return data;
};

export default useUserData;
