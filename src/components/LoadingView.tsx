import React from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import SafeView from './SafeView';

const LoadingView = () => {
  return (
    <SafeView contentContainerStyle={styles.container}>
      <ActivityIndicator size="large" />
    </SafeView>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
