import {useEffect, useState} from 'react';

import protectedSpacesService from '../services/protectedSpacesService';
import type {ProtectedSpace} from '../utils/types';
import log from '../utils/log';

type Status = 'idle' | 'loading' | 'error';

const useProtectedSpace = (id: string) => {
  const [status, setStatus] = useState<Status>('loading');
  const [space, setSpace] = useState<ProtectedSpace | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setSpace(await protectedSpacesService.findById(id));
        setStatus('idle');
      } catch (error) {
        log.error(error);
        setStatus('error');
      }
    })();
  }, [id]);

  return {
    status,
    protectedSpace: space,
  };
};

export default useProtectedSpace;
