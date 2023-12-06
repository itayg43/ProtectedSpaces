import {useEffect, useState} from 'react';

import protectedSpacesService from '../services/protectedSpacesService';
import type {ProtectedSpace, RequestStatus} from '../utils/types';
import log from '../utils/log';

type UseProtectedSpaceData = {
  initialRequestStatus: RequestStatus;
  protectedSpace: ProtectedSpace | null;
};

const initialData: UseProtectedSpaceData = {
  initialRequestStatus: 'loading',
  protectedSpace: null,
};

const useProtectedSpace = (id: string) => {
  const [data, setData] = useState<UseProtectedSpaceData>(initialData);

  useEffect(() => {
    (async () => {
      try {
        setData({
          initialRequestStatus: 'idle',
          protectedSpace: await protectedSpacesService.findById(id),
        });
      } catch (error) {
        log.error(error);
        setData(currectData => ({
          ...currectData,
          initialRequestStatus: 'error',
        }));
      }
    })();
  }, [id]);

  return data;
};

export default useProtectedSpace;
