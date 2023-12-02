import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-paper';

type Props = {
  message: string;
  buttonLabel: string;
  onPress: () => void;
};

const ErrorView = ({message, buttonLabel, onPress}: Props) => {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>

      <Button mode="contained" onPress={onPress}>
        {buttonLabel}
      </Button>
    </View>
  );
};

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 10,
  },
});
