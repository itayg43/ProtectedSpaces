import React, {PropsWithChildren} from 'react';
import {
  KeyboardAvoidingView as AvoidingView,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

const KeyboardAvoidingView = ({children}: PropsWithChildren) => {
  return (
    <AvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </AvoidingView>
  );
};

export default KeyboardAvoidingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
