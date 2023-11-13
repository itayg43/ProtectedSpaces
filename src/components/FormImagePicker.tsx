import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
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
      quality: 0.3,
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
      <Button mode="contained" onPress={handlePickImage}>
        {value ? 'Change Image' : 'Pick Image'}
      </Button>

      {value && <FastImage style={styles.image} source={{uri: value.uri}} />}
    </View>
  );
};

export default FormImagePicker;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
});
