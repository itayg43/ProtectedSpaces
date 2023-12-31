import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {AppRegistry, StyleSheet} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import App from './src/App';
import {AuthContextProvider} from './src/contexts/authContext';
import {LocationContextProvider} from './src/contexts/locationContext';

const RootApp = () => {
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <PaperProvider>
        <NavigationContainer>
          <LocationContextProvider>
            <AuthContextProvider>
              <App />
            </AuthContextProvider>
          </LocationContextProvider>
        </NavigationContainer>
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
