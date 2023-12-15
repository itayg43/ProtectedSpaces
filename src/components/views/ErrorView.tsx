import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-paper';

type Props = {
  message?: string;
  onGoBack?: () => void;
  onTryAgain?: () => void;
};

const ErrorView = ({
  message = 'Unexpected error',
  onGoBack,
  onTryAgain,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>

      <View style={styles.buttonsContainer}>
        {onGoBack && (
          <Button mode="contained" onPress={onGoBack}>
            Go Back
          </Button>
        )}

        {onTryAgain && (
          <Button mode="contained" onPress={onTryAgain}>
            Try Again
          </Button>
        )}
      </View>
    </View>
  );
};

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    marginTop: 10,
  },
});
