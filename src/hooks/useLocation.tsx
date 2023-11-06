import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

import type {Location} from '../utils/types';
import usePermission from './usePermission';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
});

const useLocation = () => {
  const permissionStatus = usePermission('locationWhenInUse');

  const locationSubscriptionRef = useRef<number | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const handleLocationSubscription = () => {
    locationSubscriptionRef.current = Geolocation.watchPosition(
      position => {
        setLocation(position.coords);
      },
      _ => {},
      {
        enableHighAccuracy: true,
      },
    );
  };

  const handleLocationUnsubscribe = () => {
    if (locationSubscriptionRef.current) {
      Geolocation.clearWatch(locationSubscriptionRef.current);
    }
  };

  useEffect(() => {
    if (permissionStatus !== 'granted') {
      return;
    }

    handleLocationSubscription();

    return handleLocationUnsubscribe;
  }, [permissionStatus]);

  return location;
};

export default useLocation;
