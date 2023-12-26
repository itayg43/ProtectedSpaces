import {useCallback, useEffect} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useImmerReducer} from 'use-immer';

import type {
  AddCommentFormData,
  Comment,
  RequestStatus,
  Space,
} from '../utils/types';
import log from '../utils/log';
import commentsService from '../services/commentsService';
import {useAuthContext} from '../contexts/authContext';
import spacesService from '../services/spacesService';

type SpaceDetailsReducerData = {
  status: RequestStatus;
  errorMessage: string;
  space: Space | null;
  comments: Comment[];
  commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

const initialReducerData: SpaceDetailsReducerData = {
  status: 'loading',
  errorMessage: '',
  space: null,
  comments: [],
  commentsLastDoc: null,
};

type SpaceDetailsReducerAction =
  | {
      type: 'GET_INITIAL_DATA_SUCCESS';
      payload: {
        space: Space;
        comments: Comment[];
        commentsLastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {
      type: 'GET_INITIAL_DATA_FAIL';
      payload: {
        message: string;
      };
    }
  | {
      type: 'GET_MORE_COMMENTS_SUCCESS';
      payload: {
        comments: Comment[];
        commentsLastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {
      type: 'ADD_COMMENT_SUCCESS';
      payload: {
        comment: Comment;
      };
    };

const useSpaceDetails = (id: string) => {
  const authContext = useAuthContext();

  const [data, dispatch] = useImmerReducer<
    SpaceDetailsReducerData,
    SpaceDetailsReducerAction
  >(spaceDetailsReducer, initialReducerData);

  const handleGetInitalData = useCallback(async () => {
    try {
      const [space, commentsRes] = await Promise.all([
        spacesService.findById(id),
        commentsService.findBySpaceId(id),
      ]);

      if (space === null) {
        throw new Error('');
      }

      dispatch({
        type: 'GET_INITIAL_DATA_SUCCESS',
        payload: {
          space,
          comments: commentsRes.comments,
          commentsLastDocument: commentsRes.lastDocument,
        },
      });
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_INITIAL_DATA_FAIL',
        payload: {
          message: 'Get data error',
        },
      });
    }
  }, [id, dispatch]);

  const handleGetMoreComments = useCallback(async () => {
    if (!data.commentsLastDoc) {
      return;
    }

    try {
      const commentsRes = await commentsService.findBySpaceId(
        id,
        data.commentsLastDoc,
      );
      dispatch({
        type: 'GET_MORE_COMMENTS_SUCCESS',
        payload: {
          comments: commentsRes.comments,
          commentsLastDocument: commentsRes.lastDocument,
        },
      });
    } catch (error) {
      log.error(error);
    }
  }, [id, data.commentsLastDoc, dispatch]);

  const handleAddComment = useCallback(
    async (formData: AddCommentFormData) => {
      if (!authContext?.user) {
        return;
      }

      try {
        const comment = await commentsService.add(
          authContext.user,
          formData,
          id,
        );
        dispatch({
          type: 'ADD_COMMENT_SUCCESS',
          payload: {
            comment,
          },
        });
      } catch (error) {
        log.error(error);
        throw new Error('Add comment error');
      }
    },
    [authContext?.user, id, dispatch],
  );

  useEffect(() => {
    handleGetInitalData();
  }, [handleGetInitalData]);

  return {
    status: data.status,
    errorMessage: data.errorMessage,
    space: data.space,
    comments: data.comments,
    handleGetMoreComments,
    handleAddComment,
  };
};

export default useSpaceDetails;

function spaceDetailsReducer(
  draft: SpaceDetailsReducerData,
  action: SpaceDetailsReducerAction,
) {
  switch (action.type) {
    case 'GET_INITIAL_DATA_SUCCESS': {
      const {space, comments, commentsLastDocument} = action.payload;
      draft.status = 'success';
      draft.space = space;
      draft.comments = comments;
      draft.commentsLastDoc = commentsLastDocument;
      break;
    }

    case 'GET_INITIAL_DATA_FAIL': {
      const {message} = action.payload;
      draft.status = 'error';
      draft.errorMessage = message;
      break;
    }

    case 'GET_MORE_COMMENTS_SUCCESS': {
      const {comments, commentsLastDocument} = action.payload;
      draft.comments = [...draft.comments, ...comments];
      draft.commentsLastDoc = commentsLastDocument;
      break;
    }

    case 'ADD_COMMENT_SUCCESS': {
      const {comment} = action.payload;
      draft.comments = [comment, ...draft.comments];
      break;
    }
  }
}
