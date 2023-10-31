import React, {useCallback, useEffect} from 'react';
import {Alert, Platform, Linking} from 'react-native';
import RNPermissions, {PERMISSIONS} from 'react-native-permissions';

import ProtectedSpacesMapScreen from './screens/ProtectedSpacesMapScreen';

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const App = () => {
  const handleLocationPermission = useCallback(async () => {
    try {
      let status = await RNPermissions.check(LOCATION_PERMISSION);

      if (status === 'denied') {
        status = await RNPermissions.request(LOCATION_PERMISSION);
      }

      if (status === 'blocked') {
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
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleLocationPermission();
  }, [handleLocationPermission]);

  return <ProtectedSpacesMapScreen />;
};

export default App;
