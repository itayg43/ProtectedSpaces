import {useCallback, useEffect, useReducer} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import type {AddCommentFormData, Comment, RequestStatus} from '../utils/types';
import log from '../utils/log';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';

type SpaceCommentsReducerData = {
  status: RequestStatus;
  errorMessage: string;
  comments: Comment[];
  lastCommentDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

const initialReducerData: SpaceCommentsReducerData = {
  status: 'loading',
  errorMessage: '',
  comments: [],
  lastCommentDocument: null,
};

const useSpaceComments = (spaceId: string) => {
  const authContext = useAuthContext();

  const [{status, errorMessage, comments, lastCommentDocument}, dispatch] =
    useReducer(spaceCommentsReducer, initialReducerData);

  const handleGetInitalComments = useCallback(async () => {
    try {
      dispatch({
        type: 'GET_INITIAL_SUCCESS',
        payload: await commentsService.findBySpaceId(spaceId),
      });
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_INITIAL_FAIL',
        payload: 'Get comments error',
      });
    }
  }, [spaceId]);

  const handleGetMoreComments = useCallback(async () => {
    if (!lastCommentDocument) {
      return;
    }

    try {
      dispatch({
        type: 'GET_MORE',
        payload: await commentsService.findBySpaceId(
          spaceId,
          lastCommentDocument,
        ),
      });
    } catch (error) {
      log.error(error);
    }
  }, [spaceId, lastCommentDocument]);

  const handleAddComment = useCallback(
    async (formData: AddCommentFormData) => {
      if (!authContext?.user) {
        return;
      }

      try {
        dispatch({
          type: 'ADD',
          payload: await commentsService.add(
            authContext.user,
            formData,
            spaceId,
          ),
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add comment error');
      }
    },
    [authContext, spaceId],
  );

  useEffect(() => {
    handleGetInitalComments();
  }, [handleGetInitalComments]);

  return {
    commentsStatus: status,
    commentsErrorMessage: errorMessage,
    comments,
    handleGetMoreComments,
    handleAddComment,
  };
};

export default useSpaceComments;

type GetPayload = {
  comments: Comment[];
  lastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot;
};

type SpaceCommentsReducerAction = {
  type: 'GET_INITIAL_SUCCESS' | 'GET_INITIAL_FAIL' | 'GET_MORE' | 'ADD';
  payload: GetPayload | Comment | string;
};

function spaceCommentsReducer(
  data: SpaceCommentsReducerData,
  action: SpaceCommentsReducerAction,
): SpaceCommentsReducerData {
  switch (action.type) {
    case 'GET_INITIAL_SUCCESS': {
      const {comments, lastDocument} = action.payload as GetPayload;
      return {
        ...data,
        status: 'success',
        comments,
        lastCommentDocument: lastDocument,
      };
    }

    case 'GET_INITIAL_FAIL': {
      return {
        ...data,
        status: 'error',
        errorMessage: action.payload as string,
      };
    }

    case 'GET_MORE': {
      const {comments, lastDocument} = action.payload as GetPayload;
      return {
        ...data,
        comments: [...data.comments, ...comments],
        lastCommentDocument: lastDocument,
      };
    }

    case 'ADD': {
      const c = action.payload as Comment;
      return {
        ...data,
        comments: [c, ...data.comments],
      };
    }
  }
}
