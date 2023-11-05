import {useEffect, useRef, useState} from 'react';
import {Alert, Platform, Linking} from 'react-native';
import RNPermissions, {PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

import type {Location} from '../utils/types';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
});

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const useLocation = () => {
  const locationSubscriptionRef = useRef<number | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const handleRequestPermission = async () => {
    try {
      let status = await RNPermissions.check(LOCATION_PERMISSION);

      if (status === 'denied') {
        status = await RNPermissions.request(LOCATION_PERMISSION);
      }

      if (status === 'blocked') {
        showPermissionBlockedAlert();
      }

      return status;
    } catch (error) {
      return 'denied';
    }
  };

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
    (async () => {
      const permissionsStatus = await handleRequestPermission();

      if (permissionsStatus !== 'granted') {
        return;
      }

      handleLocationSubscription();
    })();

    return handleLocationUnsubscribe;
  }, []);

  return location;
};

export default useLocation;

function showPermissionBlockedAlert() {
  Alert.alert(
    'Error',
    'Please provide access to your location and reopen the app',
    [
      {
        text: 'Cancel',
        style: 'destructive',
      },
      {
        text: 'OK',
        onPress: async () => await Linking.openSettings(),
      },
    ],
  );
}
