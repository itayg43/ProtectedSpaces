import {useEffect, useState} from 'react';

import {ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';

const useProtectedSpacesCollection = () => {
  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      s => setProtectedSpaces(s),
      e => log.error(e),
    );

    return unsubscribe;
  }, []);

  return protectedSpaces;
};

export default useProtectedSpacesCollection;
