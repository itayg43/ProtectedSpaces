import React, {type PropsWithChildren} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
} & PropsWithChildren;

const SafeView = ({contentContainerStyle, children}: Props) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
  },
});
