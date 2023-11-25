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
} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';

type ProtectedSpacesContextParams = {
  protectedSpaces: ProtectedSpace[];
  handleAddProtectedSpace: (
    formData: AddProtectedSpaceFormData,
  ) => Promise<void>;
  handleAddComment: (
    formData: AddCommentFormData,
    protectedSpace: ProtectedSpace,
  ) => Promise<void>;
  findProtectedSpaceById: (id: string) => ProtectedSpace | null;
};

const ProtectedSpacesContext = createContext<ProtectedSpacesContextParams>({
  protectedSpaces: [],
  handleAddProtectedSpace: async () => {},
  handleAddComment: async () => {},
  findProtectedSpaceById: () => null,
});

export const ProtectedSpacesContextProvider = ({
  children,
}: PropsWithChildren) => {
  const {user} = useAuthContext();

  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

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
    async (formData: AddCommentFormData, protectedSpace: ProtectedSpace) => {
      if (!user) {
        return;
      }

      try {
        await protectedSpacesService.addComment(user, formData, protectedSpace);
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add your comment");
      }
    },
    [user],
  );

  const findProtectedSpaceById = useCallback(
    (id: string) => {
      return protectedSpaces.find(p => p.id === id) ?? null;
    },
    [protectedSpaces],
  );

  const contextValues = useMemo(
    () => ({
      protectedSpaces,
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
    }),
    [
      protectedSpaces,
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
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
