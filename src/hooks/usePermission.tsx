import {useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import RNPermissions, {
  PERMISSIONS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

const isIOS = Platform.OS === 'ios';

type PermissionType = 'locationWhenInUse';

type PermissionOption = {
  [type in PermissionType]: Permission;
};

const PERMISSION_OPTIONS: PermissionOption = {
  locationWhenInUse: isIOS
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const usePermission = (permissionType: PermissionType) => {
  const permission = PERMISSION_OPTIONS[permissionType];
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let status = await RNPermissions.check(permission);

        if (status === 'denied') {
          status = await RNPermissions.request(permission);
        }

        if (status === 'blocked') {
          showPermissionBlockedAlert(permissionType);
        }

        setPermissionStatus(status);
      } catch (error) {
        setPermissionStatus('denied');
      }
    })();
  }, [permission, permissionType]);

  return permissionStatus;
};

export default usePermission;

function showPermissionBlockedAlert(permissionType: PermissionType) {
  Alert.alert(
    'Error',
    `Please provide access to ${permissionType} and reopen the app`,
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
