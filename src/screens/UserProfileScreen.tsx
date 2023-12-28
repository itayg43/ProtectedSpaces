import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import Slider from '@react-native-community/slider';

import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {useNavigation} from '@react-navigation/native';
import {UserProfileScreenNavigationProps} from '../navigators/DrawerNavigator';
import {useProfileContext} from '../contexts/profileContext';

const MIN_RADIUS_IN_M = 25;
const MAX_RADIUS_IN_M = 150;
const STEP_IN_M = 25;

const UserProfileScreen = () => {
  const safeAreaInsetsContext = useSafeAreaInsetsContext();

  const navigation = useNavigation<UserProfileScreenNavigationProps>();

  const profileContext = useProfileContext();

  const [sliderValue, setSliderValue] = useState(profileContext.radiusInM);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: safeAreaInsetsContext.top,
          marginBottom: safeAreaInsetsContext.bottom,
        },
      ]}>
      <IconButton
        style={styles.goBackButton}
        mode="contained"
        icon="keyboard-backspace"
        onPress={handleGoBack}
      />

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderTitle}>Radius (Meters):</Text>

        <Slider
          minimumValue={MIN_RADIUS_IN_M}
          maximumValue={MAX_RADIUS_IN_M}
          step={STEP_IN_M}
          value={sliderValue}
          onSlidingComplete={async value =>
            await profileContext.handleRadiusChange(value)
          }
          onValueChange={setSliderValue}
          minimumTrackTintColor="#6200ee"
        />

        <View style={styles.sliderLabelsContainer}>
          <Text style={styles.colorBlack}>{MIN_RADIUS_IN_M}</Text>

          {sliderValue !== MIN_RADIUS_IN_M &&
            sliderValue !== MAX_RADIUS_IN_M && (
              <Text style={styles.colorBlack}>{sliderValue}</Text>
            )}

          <Text style={styles.colorBlack}>{MAX_RADIUS_IN_M}</Text>
        </View>
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
  sliderTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colorBlack: {
    color: 'black',
  },
});
