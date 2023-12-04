import {useCallback, useEffect, useState} from 'react';
import {Comment, ProtectedSpace} from '../utils/types';

import protectedSpacesService from '../services/protectedSpacesService';
import commentsService from '../services/commentsService';
import log from '../utils/log';

type Status = 'idle' | 'loading' | 'error';

type Data = {
  status: Status;
  protectedSpaces: ProtectedSpace[];
  comments: Comment[];
};

const initialState: Data = {
  status: 'loading',
  protectedSpaces: [],
  comments: [],
};

const useUserProtectedSpacesAndComments = (uid?: string) => {
  const [data, setData] = useState<Data>(initialState);

  const handleGetData = useCallback(async (id: string) => {
    try {
      const [s, c] = await Promise.all([
        protectedSpacesService.findByUserId(id),
        commentsService.findByUserId(id),
      ]);
      setData({
        status: 'idle',
        protectedSpaces: s,
        comments: c,
      });
    } catch (error) {
      log.error(error);
      setData(currentData => ({
        ...currentData,
        status: 'error',
      }));
    }
  }, []);

  useEffect(() => {
    if (!uid) {
      return;
    }

    handleGetData(uid);
  }, [uid, handleGetData]);

  return data;
};

export default useUserProtectedSpacesAndComments;
