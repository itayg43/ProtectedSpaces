import React from 'react';
import {StyleProp, View, ViewStyle, FlatList, StyleSheet} from 'react-native';
import {UseControllerProps, useController} from 'react-hook-form';

import type {AddProtectedSpaceFormData, ImageAsset} from '../utils/types';
import ImagePicker from './ImagePicker';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  amount: number;
} & UseControllerProps<AddProtectedSpaceFormData>;

const FormImagesPicker = ({
  contentContainerStyle,
  control,
  name,
  amount,
}: Props) => {
  const {
    field: {value, onChange},
  } = useController({control, name});

  const isValueArray = Array.isArray(value);

  const handleSelect = (asset: ImageAsset, index: number) => {
    if (isValueArray) {
      let newValue: ImageAsset[] = [];

      // empty array
      if (value.length === 0) {
        newValue = [asset];
      }

      // change already selected image
      if (value[index]) {
        newValue = value.map((currAsset, i) =>
          i === index ? asset : currAsset,
        );
      }

      // add new image
      if (!value[index]) {
        newValue = [...value, asset];
      }

      onChange(newValue);
    }
  };

  return (
    <>
      {isValueArray && (
        <View style={contentContainerStyle}>
          <FlatList
            data={[...Array(amount).keys()]}
            keyExtractor={item => item.toString()}
            renderItem={({index}) => (
              <ImagePicker
                imageAsset={value[index]}
                onSelect={asset => handleSelect(asset, index)}
              />
            )}
            horizontal
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      )}
    </>
  );
};

export default FormImagesPicker;

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    marginRight: 5,
  },
});
