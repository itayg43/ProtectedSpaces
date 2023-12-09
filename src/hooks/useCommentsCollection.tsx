import {useEffect, useState} from 'react';

import {Comment} from '../utils/types';
import commentsService from '../services/commentsService';
import log from '../utils/log';

const useCommentsCollection = (spaceId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!spaceId) {
      return;
    }

    const unsubscribe = commentsService.collectionSubscription(
      spaceId,
      c => setComments(c),
      e => log.error(e),
    );

    return unsubscribe;
  }, [spaceId]);

  return comments;
};

export default useCommentsCollection;
