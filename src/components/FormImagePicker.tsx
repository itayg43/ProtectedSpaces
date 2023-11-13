import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {useController} from 'react-hook-form';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  control: any;
  name: string;
};

const FormImagePicker = ({contentContainerStyle, control, name}: Props) => {
  const {
    field: {value, onChange},
  } = useController({control, name});

  const handlePickImage = async () => {
    const {assets} = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.1,
    });

    if (assets) {
      onChange({
        name: assets[0].fileName,
        uri: assets[0].uri,
      });
    }
  };

  return (
    <View style={[contentContainerStyle]}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handlePickImage}>
        {!value ? (
          <IconButton mode="contained" icon="plus" size={22} />
        ) : (
          <FastImage style={styles.image} source={{uri: value.uri}} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FormImagePicker;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
