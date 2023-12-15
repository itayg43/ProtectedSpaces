import {useCallback, useEffect, useState} from 'react';

import {useAuthContext} from '../contexts/authContext';
import type {Comment, RequestStatus, Space} from '../utils/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import log from '../utils/log';
import spacesService from '../services/spacesService';
import commentsService from '../services/commentsService';

const useUserData = () => {
  const {user} = useAuthContext();

  const [status, setStatus] = useState<RequestStatus>('loading');

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spacesLastDoc, setSpacesLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLastDoc, setCommentsLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);

  const handleGetInitalData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const {uid} = user;

      const [sRes, cRes] = await Promise.all([
        spacesService.findByUserId(uid),
        commentsService.findByUserId(uid),
      ]);

      setSpacesLastDoc(sRes.lastDocument);
      setSpaces(sRes.spaces);

      setCommentsLastDoc(cRes.lastDocument);
      setComments(cRes.comments);

      setStatus('idle');
    } catch (error) {
      log.error(error);
      setStatus('error');
    }
  }, [user]);

  const handleGetMoreSpaces = useCallback(async () => {
    if (!user || !spacesLastDoc) {
      return;
    }

    try {
      const res = await spacesService.findByUserId(user.uid, spacesLastDoc);
      setSpacesLastDoc(res.lastDocument);
      setSpaces(currSpaces => [...currSpaces, ...res.spaces]);
    } catch (error) {
      log.error(error);
    }
  }, [user, spacesLastDoc]);

  const handleGetMoreComments = useCallback(async () => {
    if (!user || !commentsLastDoc) {
      return;
    }

    try {
      const res = await commentsService.findByUserId(user.uid, commentsLastDoc);
      setCommentsLastDoc(res.lastDocument);
      setComments(currComments => [...currComments, ...res.comments]);
    } catch (error) {
      log.error(error);
    }
  }, [user, commentsLastDoc]);

  useEffect(() => {
    handleGetInitalData();
  }, [handleGetInitalData]);

  return {
    status,
    spaces,
    comments,
    handleGetMoreSpaces,
    handleGetMoreComments,
  };
};

export default useUserData;
