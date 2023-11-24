import React, {PropsWithChildren} from 'react';
import {
  KeyboardAvoidingView as AvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';

const KeyboardAvoidingView = ({children}: PropsWithChildren) => {
  return (
    <AvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </AvoidingView>
  );
};

export default KeyboardAvoidingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
