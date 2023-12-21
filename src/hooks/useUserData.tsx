import {useCallback, useEffect, useReducer} from 'react';

import {useAuthContext} from '../contexts/authContext';
import type {Comment, RequestStatus, Space} from '../utils/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import log from '../utils/log';
import alert from '../utils/alert';
import spacesService from '../services/spacesService';
import commentsService from '../services/commentsService';
import {useSpacesContext} from '../contexts/spacesContext';

type SpacesData = {
  spaces: Space[];
  spacesLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

type CommentsData = {
  comments: Comment[];
  commentsLastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
};

type UserDataReducerData = {
  status: RequestStatus;
  errorMessage: string;
} & SpacesData &
  CommentsData;

const initialReducerData: UserDataReducerData = {
  status: 'loading',
  errorMessage: '',
  spaces: [],
  spacesLastDoc: null,
  comments: [],
  commentsLastDoc: null,
};

const useUserData = () => {
  const authContext = useAuthContext();
  const spacesContext = useSpacesContext();

  const [
    {status, errorMessage, spaces, spacesLastDoc, comments, commentsLastDoc},
    dispatch,
  ] = useReducer(userDataReducer, initialReducerData);

  const handleGetInitalData = useCallback(async () => {
    if (!authContext?.user) {
      return;
    }

    try {
      const [sRes, cRes] = await Promise.all([
        spacesService.findByUserId(authContext.user.uid),
        commentsService.findByUserId(authContext.user.uid),
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
      dispatch({type: 'GET_INITIAL_FAIL', payload: 'Get initial error'});
    }
  }, [authContext]);

  const handleGetMoreSpaces = useCallback(async () => {
    if (!authContext?.user || !spacesLastDoc) {
      return;
    }

    try {
      const res = await spacesService.findByUserId(
        authContext.user.uid,
        spacesLastDoc,
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
  }, [authContext, spacesLastDoc]);

  const handleGetMoreComments = useCallback(async () => {
    if (!authContext?.user || !commentsLastDoc) {
      return;
    }

    try {
      const res = await commentsService.findByUserId(
        authContext.user.uid,
        commentsLastDoc,
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
  }, [authContext, commentsLastDoc]);

  const handleDeleteSpace = useCallback(
    (id: string) => {
      alert.remove(async () => {
        try {
          await spacesService.deleteByIdIncludeComments(id);
          spacesContext?.handleDeleteSpace(id);
          dispatch({type: 'DELETE_SPACE_SUCCESS', payload: id});
        } catch (error) {
          log.error(error);
          alert.error('Delete space error');
        }
      });
    },
    [spacesContext],
  );

  const handleDeleteComment = useCallback(
    (spaceId: string, commentId: string) => {
      alert.remove(async () => {
        try {
          await commentsService.deleteById(spaceId, commentId);
          dispatch({type: 'DELETE_COMMENT_SUCCESS', payload: commentId});
        } catch (error) {
          log.error(error);
          alert.error('Delete comment error');
        }
      });
    },
    [],
  );

  useEffect(() => {
    handleGetInitalData();
  }, [handleGetInitalData]);

  return {
    status,
    errorMessage,
    spaces,
    comments,
    handleGetMoreSpaces,
    handleGetMoreComments,
    handleDeleteSpace,
    handleDeleteComment,
  };
};

export default useUserData;

type GetInitialSuccessPayload = SpacesData & CommentsData;

type UserDataReducerAction = {
  type:
    | 'GET_INITIAL_SUCCESS'
    | 'GET_INITIAL_FAIL'
    | 'GET_MORE_SPACES_SUCCESS'
    | 'GET_MORE_COMMENTS_SUCCESS'
    | 'DELETE_SPACE_SUCCESS'
    | 'DELETE_COMMENT_SUCCESS';
  payload: GetInitialSuccessPayload | string | SpacesData | CommentsData;
};

function userDataReducer(
  data: UserDataReducerData,
  action: UserDataReducerAction,
): UserDataReducerData {
  switch (action.type) {
    case 'GET_INITIAL_SUCCESS': {
      const payload = action.payload as GetInitialSuccessPayload;
      return {
        ...data,
        status: 'success',
        ...payload,
      };
    }

    case 'GET_INITIAL_FAIL': {
      return {
        ...data,
        status: 'error',
        errorMessage: action.payload as string,
      };
    }

    case 'GET_MORE_SPACES_SUCCESS': {
      const payload = action.payload as SpacesData;
      return {
        ...data,
        spaces: [...data.spaces, ...payload.spaces],
        spacesLastDoc: payload.spacesLastDoc,
      };
    }

    case 'GET_MORE_COMMENTS_SUCCESS': {
      const payload = action.payload as CommentsData;
      return {
        ...data,
        comments: [...data.comments, ...payload.comments],
        commentsLastDoc: payload.commentsLastDoc,
      };
    }

    case 'DELETE_SPACE_SUCCESS': {
      const id = action.payload as string;
      return {
        ...data,
        spaces: data.spaces.filter(s => s.id !== id),
        comments: data.comments.filter(c => c.spaceId !== id),
      };
    }

    case 'DELETE_COMMENT_SUCCESS': {
      const id = action.payload as string;
      return {
        ...data,
        comments: data.comments.filter(c => c.id !== id),
      };
    }
  }
}
