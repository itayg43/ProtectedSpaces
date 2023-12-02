import {useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import RNPermissions, {
  PERMISSIONS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

import log from '../utils/log';
import errorAlert from '../utils/errorAlert';

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
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let s = await RNPermissions.check(permission);

        if (s === 'denied') {
          s = await RNPermissions.request(permission);
        }

        if (s === 'blocked') {
          showPermissionBlockedAlert(permissionType);
        }

        setStatus(s);
      } catch (error) {
        log.error(error);
        setStatus('denied');
      }
    })();
  }, [permission, permissionType]);

  return status;
};

export default usePermission;

function showPermissionBlockedAlert(permissionType: PermissionType) {
  errorAlert.show(
    `Please provide access to ${permissionType} and reopen the app`,
    [
      {text: 'Cancel', style: 'destructive'},
      {text: 'OK', onPress: async () => await Linking.openSettings()},
    ],
  );
}
