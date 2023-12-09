import {useEffect, useState} from 'react';

import {Space} from '../utils/types';
import spacesService from '../services/spacesService';
import log from '../utils/log';

const useSpacesCollection = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    const unsubscribe = spacesService.collectionSubscription(
      s => setSpaces(s),
      e => log.error(e),
    );

    return unsubscribe;
  }, []);

  return spaces;
};

export default useSpacesCollection;
