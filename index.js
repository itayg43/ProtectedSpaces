import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, StyleSheet} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import App from './src/App';
import {AuthProvider} from './src/contexts/AuthContext';

const RootApp = () => {
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <AuthProvider>
        <PaperProvider>
          <BottomSheetModalProvider>
            <App />
          </BottomSheetModalProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
