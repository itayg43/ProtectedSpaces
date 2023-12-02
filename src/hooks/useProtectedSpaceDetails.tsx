import {useEffect, useState} from 'react';

import protectedSpacesService from '../services/protectedSpacesService';
import commentsService from '../services/commentsService';
import type {Comment, ProtectedSpace} from '../utils/types';
import log from '../utils/log';

type Status = 'idle' | 'loading' | 'error';

const useProtectedSpaceDetails = (id: string) => {
  const [status, setStatus] = useState<Status>('loading');
  const [space, setSpace] = useState<ProtectedSpace | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

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

  useEffect(() => {
    if (!space) {
      return;
    }

    const unsubscribe = commentsService.collectionSubscription(
      space.id,
      c => setComments(c),
      e => log.error(e),
    );

    return unsubscribe;
  }, [space]);

  return {
    status,
    protectedSpace: space,
    comments,
  };
};

export default useProtectedSpaceDetails;
