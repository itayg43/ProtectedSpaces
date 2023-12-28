import {useCallback, useEffect} from 'react';
import {useImmerReducer} from 'use-immer';

import {useAuthContext} from '../contexts/authContext';
import type {Comment, RequestStatus, Space} from '../utils/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import log from '../utils/log';
import alert from '../utils/alert';
import spacesService from '../services/spacesService';
import commentsService from '../services/commentsService';
import {useSpacesContext} from '../contexts/spacesContext';

type UserDataReducerData = {
  status: RequestStatus;
  errorMessage: string;
  spaces: Space[];
  spacesLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
  comments: Comment[];
  commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

const initialReducerData: UserDataReducerData = {
  status: 'loading',
  errorMessage: '',
  spaces: [],
  spacesLastDoc: null,
  comments: [],
  commentsLastDoc: null,
};

type UserDataReducerAction =
  | {
      type: 'GET_INITIAL_SUCCESS';
      payload: {
        spaces: Space[];
        spacesLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot;
        comments: Comment[];
        commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {type: 'GET_INITIAL_FAIL'; payload: {message: string}}
  | {
      type: 'GET_MORE_SPACES_SUCCESS';
      payload: {
        spaces: Space[];
        spacesLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {
      type: 'GET_MORE_COMMENTS_SUCCESS';
      payload: {
        comments: Comment[];
        commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot;
      };
    }
  | {type: 'DELETE_SPACE_SUCCESS'; payload: {id: string}}
  | {type: 'DELETE_COMMENT_SUCCESS'; payload: {id: string}};

const useUserData = () => {
  const authContext = useAuthContext();
  const spacesContext = useSpacesContext();

  const [data, dispatch] = useImmerReducer<
    UserDataReducerData,
    UserDataReducerAction
  >(userDataReducer, initialReducerData);

  const handleGetInitalData = useCallback(async () => {
    if (authContext.user === null) {
      return;
    }

    try {
      const {uid} = authContext.user;

      const [sRes, cRes] = await Promise.all([
        spacesService.findByUserId(uid),
        commentsService.findByUserId(uid),
      ]);

      dispatch({
        type: 'GET_INITIAL_SUCCESS',
        payload: {
          spaces: sRes.spaces,
          spacesLastDoc: sRes.lastDocument,
          comments: cRes.comments,
          commentsLastDoc: cRes.lastDocument,
        },
      });
    } catch (error) {
      log.error(error);
      dispatch({
        type: 'GET_INITIAL_FAIL',
        payload: {message: 'Get data error'},
      });
    }
  }, [authContext.user, dispatch]);

  const handleGetMoreSpaces = useCallback(async () => {
    if (authContext.user === null || !data.spacesLastDoc) {
      return;
    }

    try {
      const res = await spacesService.findByUserId(
        authContext.user.uid,
        data.spacesLastDoc,
      );
      dispatch({
        type: 'GET_MORE_SPACES_SUCCESS',
        payload: {
          spaces: res.spaces,
          spacesLastDoc: res.lastDocument,
        },
      });
    } catch (error) {
      log.error(error);
    }
  }, [authContext.user, data.spacesLastDoc, dispatch]);

  const handleGetMoreComments = useCallback(async () => {
    if (authContext.user === null || !data.commentsLastDoc) {
      return;
    }

    try {
      const res = await commentsService.findByUserId(
        authContext.user.uid,
        data.commentsLastDoc,
      );
      dispatch({
        type: 'GET_MORE_COMMENTS_SUCCESS',
        payload: {
          comments: res.comments,
          commentsLastDoc: res.lastDocument,
        },
      });
    } catch (error) {
      log.error(error);
    }
  }, [authContext.user, data.commentsLastDoc, dispatch]);

  const handleDeleteSpace = useCallback(
    (id: string) => {
      alert.remove(async () => {
        try {
          await spacesService.deleteByIdIncludeComments(id);
          spacesContext?.handleDeleteSpace(id);
          dispatch({type: 'DELETE_SPACE_SUCCESS', payload: {id}});
        } catch (error) {
          log.error(error);
          alert.error('Delete space error');
        }
      });
    },
    [spacesContext, dispatch],
  );

  const handleDeleteComment = useCallback(
    (spaceId: string, commentId: string) => {
      alert.remove(async () => {
        try {
          await commentsService.deleteById(spaceId, commentId);
          dispatch({type: 'DELETE_COMMENT_SUCCESS', payload: {id: commentId}});
        } catch (error) {
          log.error(error);
          alert.error('Delete comment error');
        }
      });
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetInitalData();
  }, [handleGetInitalData]);

  return {
    status: data.status,
    errorMessage: data.errorMessage,
    spaces: data.spaces,
    comments: data.comments,
    handleGetMoreSpaces,
    handleGetMoreComments,
    handleDeleteSpace,
    handleDeleteComment,
  };
};

export default useUserData;

function userDataReducer(
  draft: UserDataReducerData,
  action: UserDataReducerAction,
) {
  switch (action.type) {
    case 'GET_INITIAL_SUCCESS': {
      draft.status = 'success';
      draft.spaces = action.payload.spaces;
      draft.spacesLastDoc = action.payload.spacesLastDoc;
      draft.comments = action.payload.comments;
      draft.commentsLastDoc = action.payload.commentsLastDoc;
      break;
    }

    case 'GET_INITIAL_FAIL': {
      draft.status = 'error';
      draft.errorMessage = action.payload.message;
      break;
    }

    case 'GET_MORE_SPACES_SUCCESS': {
      draft.spaces = [...draft.spaces, ...action.payload.spaces];
      draft.spacesLastDoc = action.payload.spacesLastDoc;
      break;
    }

    case 'GET_MORE_COMMENTS_SUCCESS': {
      draft.comments = [...draft.comments, ...action.payload.comments];
      draft.commentsLastDoc = action.payload.commentsLastDoc;
      break;
    }

    case 'DELETE_SPACE_SUCCESS': {
      draft.spaces = draft.spaces.filter(s => s.id !== action.payload.id);
      draft.comments = draft.comments.filter(
        c => c.spaceId !== action.payload.id,
      );
      break;
    }

    case 'DELETE_COMMENT_SUCCESS': {
      draft.comments = draft.comments.filter(c => c.id !== action.payload.id);
      break;
    }
  }
}
