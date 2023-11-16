import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {TextInput, TextInputProps, HelperText} from 'react-native-paper';
import {FieldValues, UseControllerProps, useController} from 'react-hook-form';

type Props<T extends FieldValues> = {
  contentContainerStyle?: StyleProp<ViewStyle>;
} & TextInputProps &
  UseControllerProps<T>;

const FormTextInput = <T extends FieldValues>({
  contentContainerStyle,
  control,
  name,
  ...otherProps
}: Props<T>) => {
  const {
    field: {value, onChange, onBlur},
    fieldState: {invalid, error},
  } = useController({control, name});

  return (
    <View style={contentContainerStyle}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        {...otherProps}
      />

      {invalid && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default FormTextInput;
