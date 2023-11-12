import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

import type {Location} from '../utils/types';
import usePermission from './usePermission';
import log from '../utils/log';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  locationProvider: 'playServices', // android only
});

const useLocation = () => {
  const permissionStatus = usePermission('locationWhenInUse');

  const subscriptionRef = useRef<number | null>(null);

  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (permissionStatus === 'granted') {
      subscriptionRef.current = Geolocation.watchPosition(
        position => setLocation(position.coords),
        error => log.error(error),
        {
          enableHighAccuracy: true,
        },
      );
    }

    return () => {
      if (subscriptionRef.current) {
        Geolocation.clearWatch(subscriptionRef.current);
      }
    };
  }, [permissionStatus]);

  return location;
};

export default useLocation;
