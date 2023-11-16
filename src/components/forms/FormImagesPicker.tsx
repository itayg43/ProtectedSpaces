import React from 'react';
import {StyleProp, View, ViewStyle, FlatList, StyleSheet} from 'react-native';
import {HelperText} from 'react-native-paper';
import {FieldValues, UseControllerProps, useController} from 'react-hook-form';

import type {ImageAsset} from '../../utils/types';
import ImagePicker from '../ImagePicker';

type Props<T extends FieldValues> = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  amount: number;
} & UseControllerProps<T>;

const FormImagesPicker = <T extends FieldValues>({
  contentContainerStyle,
  control,
  name,
  amount,
}: Props<T>) => {
  const {
    field: {value, onChange},
    fieldState: {invalid, error},
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
        newValue = value.map((currAsset: string, i: number) =>
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

          {invalid && <HelperText type="error">{error?.message}</HelperText>}
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
