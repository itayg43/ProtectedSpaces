import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import Slider from '@react-native-community/slider';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {useNavigation} from '@react-navigation/native';
import {UserProfileScreenNavigationProps} from '../navigators/DrawerNavigator';
import {useProfileContext} from '../contexts/profileContext';

const MIN_RADIUS_IN_M = 100;
const MAX_RADIUS_IN_M = 800;
const STEP_IN_M = 50;

const UserProfileScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const navigation = useNavigation<UserProfileScreenNavigationProps>();

  const {radiusInM, handleRadiusChange} = useProfileContext();

  const [sliderValue, setSliderValue] = useState(radiusInM);

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

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Radius (Meters)</Text>

        <Slider
          minimumValue={MIN_RADIUS_IN_M}
          maximumValue={MAX_RADIUS_IN_M}
          step={STEP_IN_M}
          value={sliderValue}
          onSlidingComplete={handleRadiusChange}
          onValueChange={setSliderValue}
        />

        <Text style={styles.sliderValueLabel}>{sliderValue}</Text>
      </View>
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

  sliderContainer: {
    marginTop: 10,
    padding: 20,
  },
  sliderLabel: {
    color: 'black',
    fontWeight: 'bold',
  },
  sliderValueLabel: {
    marginTop: 10,
    textAlign: 'center',
  },
});
