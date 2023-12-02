import {useEffect, useState} from 'react';

import {Comment} from '../utils/types';
import commentsService from '../services/commentsService';
import log from '../utils/log';

const useCommentsCollection = (protectedSpaceId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!protectedSpaceId) {
      return;
    }

    const unsubscribe = commentsService.collectionSubscription(
      protectedSpaceId,
      c => setComments(c),
      e => log.error(e),
    );

    return unsubscribe;
  }, [protectedSpaceId]);

  return comments;
};

export default useCommentsCollection;
