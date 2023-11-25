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
  ProtectedSpaceEntities,
  ProtectedSpacesContextParams,
} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';
import {useAuthContext} from './authContext';

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

  const [entities, setEntities] = useState<ProtectedSpaceEntities | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

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
      if (!user || !entities || !selectedEntityId) {
        return;
      }

      try {
        await protectedSpacesService.addComment(
          user,
          formData,
          entities[selectedEntityId],
        );
      } catch (error) {
        log.error(error);
        throw new Error("We couldn't add your comment");
      }
    },
    [user, entities, selectedEntityId],
  );

  const findProtectedSpaceById = useCallback(
    (id: string) => {
      if (!entities) {
        return null;
      }

      setSelectedEntityId(id);

      return entities[id];
    },
    [entities],
  );

  const contextValues = useMemo(
    () => ({
      protectedSpaces: entities ? Object.values(entities) : [],
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
    }),
    [
      entities,
      handleAddProtectedSpace,
      handleAddComment,
      findProtectedSpaceById,
    ],
  );

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      spaces => {
        setEntities(
          spaces.reduce(
            (currentEntities, currentProtectedSpace) => ({
              ...currentEntities,
              [currentProtectedSpace.id]: currentProtectedSpace,
            }),
            {},
          ),
        );
      },
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
