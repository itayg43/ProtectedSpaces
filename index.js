import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, StyleSheet} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import App from './src/App';
import {AuthContextProvider} from './src/contexts/authContext';

const RootApp = () => {
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <PaperProvider>
        <BottomSheetModalProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </BottomSheetModalProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
