import {useCallback, useEffect, useState} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import type {AddCommentFormData, Comment, RequestStatus} from '../utils/types';
import log from '../utils/log';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';

const useSpaceComments = (spaceId: string) => {
  const {user} = useAuthContext();

  const [status, setStatus] = useState<RequestStatus>('loading');
  const [comments, setComments] = useState<Comment[]>([]);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);

  const handleGetInitalComments = useCallback(async () => {
    try {
      const res = await commentsService.findBySpaceId(spaceId);
      setLastDocument(res.lastDocument);
      setComments(res.comments);
      setStatus('idle');
    } catch (error) {
      log.error(error);
      setStatus('error');
    }
  }, [spaceId]);

  const handleGetMoreComments = useCallback(async () => {
    if (!lastDocument) {
      return;
    }

    try {
      const res = await commentsService.findBySpaceId(spaceId, lastDocument);
      setLastDocument(res.lastDocument);
      setComments(currComments => [...currComments, ...res.comments]);
    } catch (error) {
      log.error(error);
    }
  }, [spaceId, lastDocument]);

  const handleAddComment = useCallback(
    async (formData: AddCommentFormData) => {
      if (!user) {
        return;
      }

      try {
        const comment = await commentsService.add(user, formData, spaceId);
        setComments(currComments => [comment, ...currComments]);
      } catch (error) {
        log.error(error);
        throw new Error('Add comment error');
      }
    },
    [user, spaceId],
  );

  useEffect(() => {
    handleGetInitalComments();
  }, [handleGetInitalComments]);

  return {
    status,
    comments,
    handleGetMoreComments,
    handleAddComment,
  };
};

export default useSpaceComments;
