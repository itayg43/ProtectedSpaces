import {Alert, AlertButton} from 'react-native';

const show = (message: string, buttons?: AlertButton[]) => {
  Alert.alert('Error', message, buttons);
};

export default {
  show,
};
