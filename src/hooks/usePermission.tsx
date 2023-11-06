import {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import RNPermissions, {
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

const usePermission = (permission: Permission) => {
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
          showPermissionBlockedAlert();
        }

        setPermissionStatus(status);
      } catch (error) {
        setPermissionStatus('denied');
      }
    })();
  }, [permission]);

  return permissionStatus;
};

export default usePermission;

function showPermissionBlockedAlert() {
  Alert.alert('Error', 'Please provide access and reopen the app', [
    {
      text: 'Cancel',
      style: 'destructive',
    },
    {
      text: 'OK',
      onPress: async () => await Linking.openSettings(),
    },
  ]);
}
