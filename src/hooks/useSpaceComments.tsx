import {useCallback, useEffect} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useImmerReducer} from 'use-immer';

import type {AddCommentFormData, Comment, RequestStatus} from '../utils/types';
import log from '../utils/log';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';

type SpaceCommentsReducerData = {
  status: RequestStatus;
  errorMessage: string;
  comments: Comment[];
  commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

const initialReducerData: SpaceCommentsReducerData = {
  status: 'loading',
  errorMessage: '',
  comments: [],
  commentsLastDoc: null,
};

type SpaceCommentsReducerAction =
  | {
      type: 'GET_INITIAL_SUCCESS';
      payload: {
        comments: Comment[];
        lastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {type: 'GET_INITIAL_FAIL'; payload: {message: string}}
  | {
      type: 'GET_MORE_SUCCESS';
      payload: {
        comments: Comment[];
        lastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {type: 'ADD_SUCCESS'; payload: {comment: Comment}};

const useSpaceComments = (spaceId: string) => {
  const authContext = useAuthContext();

  const [data, dispatch] = useImmerReducer<
    SpaceCommentsReducerData,
    SpaceCommentsReducerAction
  >(spaceCommentsReducer, initialReducerData);

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
        payload: {message: 'Get comments error'},
      });
    }
  }, [spaceId, dispatch]);

  const handleGetMoreComments = useCallback(async () => {
    if (!data.commentsLastDoc) {
      return;
    }

    try {
      dispatch({
        type: 'GET_MORE_SUCCESS',
        payload: await commentsService.findBySpaceId(
          spaceId,
          data.commentsLastDoc,
        ),
      });
    } catch (error) {
      log.error(error);
    }
  }, [spaceId, data.commentsLastDoc, dispatch]);

  const handleAddComment = useCallback(
    async (formData: AddCommentFormData) => {
      if (!authContext?.user) {
        return;
      }

      try {
        dispatch({
          type: 'ADD_SUCCESS',
          payload: {
            comment: await commentsService.add(
              authContext.user,
              formData,
              spaceId,
            ),
          },
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add comment error');
      }
    },
    [authContext?.user, spaceId, dispatch],
  );

  useEffect(() => {
    handleGetInitalComments();
  }, [handleGetInitalComments]);

  return {
    commentsStatus: data.status,
    commentsErrorMessage: data.errorMessage,
    comments: data.comments,
    handleGetMoreComments,
    handleAddComment,
  };
};

export default useSpaceComments;

function spaceCommentsReducer(
  draft: SpaceCommentsReducerData,
  action: SpaceCommentsReducerAction,
) {
  switch (action.type) {
    case 'GET_INITIAL_SUCCESS': {
      draft.status = 'success';
      draft.comments = action.payload.comments;
      draft.commentsLastDoc = action.payload.lastDocument;
      break;
    }

    case 'GET_INITIAL_FAIL': {
      draft.status = 'error';
      draft.errorMessage = action.payload.message;
      break;
    }

    case 'GET_MORE_SUCCESS': {
      draft.comments = [...draft.comments, ...action.payload.comments];
      draft.commentsLastDoc = action.payload.lastDocument;
      break;
    }

    case 'ADD_SUCCESS': {
      draft.comments = [action.payload.comment, ...draft.comments];
      break;
    }
  }
}
