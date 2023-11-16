import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {
  SegmentedButtons,
  HelperText,
  SegmentedButtonsProps,
} from 'react-native-paper';
import {FieldValues, UseControllerProps, useController} from 'react-hook-form';

type Props<T extends FieldValues> = {
  contentContainerStyle?: StyleProp<ViewStyle>;
} & Omit<SegmentedButtonsProps, 'value' | 'onValueChange'> &
  UseControllerProps<T>;

const FormSegmentedButtons = <T extends FieldValues>({
  contentContainerStyle,
  control,
  name,
  ...otherProps
}: Props<T>) => {
  const {
    field: {value, onChange},
    fieldState: {invalid, error},
  } = useController({control, name});

  return (
    <View style={contentContainerStyle}>
      <SegmentedButtons
        value={value}
        onValueChange={onChange}
        {...otherProps}
      />

      {invalid && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default FormSegmentedButtons;
