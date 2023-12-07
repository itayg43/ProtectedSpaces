import {Alert, AlertButton} from 'react-native';

const error = (message: string, buttons?: AlertButton[]) => {
  Alert.alert('Error', message, buttons);
};

const remove = (onRemove: () => void) => {
  Alert.alert('Remove', 'Are you sure?', [
    {text: 'Cancel'},
    {text: 'Yes', onPress: onRemove, style: 'destructive'},
  ]);
};

export default {
  error,
  remove,
};
