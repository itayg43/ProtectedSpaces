import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

type Props = {
  message?: string;
};

const LoadingView = ({message}: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    color: 'black',
    marginTop: 20,
  },
});
