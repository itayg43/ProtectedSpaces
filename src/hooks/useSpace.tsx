import {useEffect, useState} from 'react';

import spacesService from '../services/spacesService';
import type {Space, RequestStatus} from '../utils/types';
import log from '../utils/log';

type UseSpaceData = {
  initialRequestStatus: RequestStatus;
  space: Space | null;
};

const initialData: UseSpaceData = {
  initialRequestStatus: 'loading',
  space: null,
};

const useSpace = (id: string) => {
  const [data, setData] = useState<UseSpaceData>(initialData);

  useEffect(() => {
    (async () => {
      try {
        setData({
          initialRequestStatus: 'idle',
          space: await spacesService.findById(id),
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

export default useSpace;
