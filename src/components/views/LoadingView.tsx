import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

type Props = {
  msg?: string;
};

const LoadingView = ({msg}: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />

      {msg && <Text style={styles.msg}>{msg}</Text>}
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
  msg: {
    color: 'black',
    marginTop: 20,
  },
});
