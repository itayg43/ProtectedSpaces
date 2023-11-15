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

import type {ImageAsset} from '../utils/types';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  imageAsset: ImageAsset | null | undefined;
  onSelect: (asset: ImageAsset) => void;
};

const ImagePicker = ({contentContainerStyle, imageAsset, onSelect}: Props) => {
  const handlePickImage = async () => {
    const {assets} = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.3,
    });

    if (assets) {
      const {fileName, uri} = assets[0];
      if (fileName && uri) {
        onSelect({
          name: fileName,
          uri,
        });
      }
    }
  };

  return (
    <View style={contentContainerStyle}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handlePickImage}>
        {!imageAsset ? (
          <IconButton mode="contained" icon="plus" size={22} />
        ) : (
          <FastImage style={styles.image} source={{uri: imageAsset.uri}} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
