import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import App from './src/App';

const RootApp = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <App />
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);
