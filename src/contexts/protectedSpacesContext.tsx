import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  AddCommentFormData,
  AddProtectedSpaceFormData,
  ProtectedSpace,
  Comment,
} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';

export type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
  handleAddProtectedSpace: (
    formData: AddProtectedSpaceFormData,
  ) => Promise<void>;
  handleAddComment: (formData: AddCommentFormData) => Promise<void>;
  findProtectedSpaceById: (id: string) => ProtectedSpace | null;
  findCurrentUserProtectedSpaces: () => ProtectedSpace[];
  findCurrentUserComments: () => Comment[];
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
  handleAddProtectedSpace: async () => {},
  handleAddComment: async () => {},
  findProtectedSpaceById: () => null,
  findCurrentUserProtectedSpaces: () => [],
  findCurrentUserComments: () => [],
});

export const ProtectedSpacesContextProvider = ({
  children,
}: PropsWithChildren) => {
  const {user} = useAuthContext();

  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);
  const [selectedProtectedSpaceId, setSelectedProtectedSpaceId] = useState<
    string | null
  >(null);

  const handleAddProtectedSpace = useCallback(
    async (formData: AddProtectedSpaceFormData) => {
      if (!user) {
        return;
      }

      try {
        await protectedSpacesService.addProtectedSpace(user, formData);
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add your protected space");
      }
    },
    [user],
  );

  const handleAddComment = useCallback(
    async (formData: AddCommentFormData) => {
      if (!user || !selectedProtectedSpaceId) {
        return;
      }

      try {
        await protectedSpacesService.addComment(
          user,
          formData,
          selectedProtectedSpaceId,
        );
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add your comment");
      }
    },
    [user, selectedProtectedSpaceId],
  );

  const findProtectedSpaceById = useCallback(
    (id: string) => {
      setSelectedProtectedSpaceId(id);

      return protectedSpaces.find(s => s.id === id) ?? null;
    },
    [protectedSpaces],
  );

  const findCurrentUserProtectedSpaces = useCallback(() => {
    if (!user) {
      return [];
    }

    return protectedSpaces.filter(s => s.user.id === user.uid);
  }, [user, protectedSpaces]);

  const findCurrentUserComments = useCallback(() => {
    if (!user) {
      return [];
    }

    const comments: Comment[] = [];

    protectedSpaces.forEach(s => {
      const currentSpaceUserComments = s.comments.filter(
        c => c.user.id === user.uid,
      );

      if (currentSpaceUserComments.length > 0) {
        comments.push(...currentSpaceUserComments);
      }
    });

    return comments;
  }, [user, protectedSpaces]);

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
      findCurrentUserProtectedSpaces,
      findCurrentUserComments,
    }),
    [
      protectedSpaces,
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
      findCurrentUserProtectedSpaces,
      findCurrentUserComments,
    ],
  );

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      spaces => setProtectedSpaces(spaces),
      error => log.error(error),
    );

    return unsubscribe;
  }, []);

  return (
    <ProtectedSpacesContext.Provider value={contextValues}>
      {children}
    </ProtectedSpacesContext.Provider>
  );
};

export const useProtectedSpacesContext = () =>
  useContext(ProtectedSpacesContext);
