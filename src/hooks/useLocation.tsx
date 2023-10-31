import {useEffect, useState} from 'react';
import {Alert, Platform, Linking} from 'react-native';
import RNPermissions, {PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
});

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

type Location = {
  latitude: number;
  longitude: number;
};

const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);

  const handleRequestPermission = async () => {
    try {
      let status = await RNPermissions.check(LOCATION_PERMISSION);

      if (status === 'denied') {
        status = await RNPermissions.request(LOCATION_PERMISSION);
      } else if (status === 'blocked') {
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

      return status;
    } catch (error) {
      return 'denied';
    }
  };

  const handleGetCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      _ => {},
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  };

  useEffect(() => {
    const handleInitialize = async () => {
      const permissionsStatus = await handleRequestPermission();

      if (permissionsStatus === 'granted') {
        handleGetCurrentLocation();
      }
    };

    handleInitialize();
  }, []);

  return {
    location,
  };
};

export default useLocation;
