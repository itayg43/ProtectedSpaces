import React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {useNavigation} from '@react-navigation/native';
import {UserProfileScreenNavigationProps} from '../navigators/DrawerNavigator';

const UserProfileScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const navigation = useNavigation<UserProfileScreenNavigationProps>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {marginTop: safeAreaInsets.top, marginBottom: safeAreaInsets.bottom},
      ]}>
      <IconButton
        style={styles.goBackButton}
        mode="contained"
        icon="keyboard-backspace"
        onPress={handleGoBack}
      />
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  goBackButton: {
    marginLeft: 20,
  },
});
