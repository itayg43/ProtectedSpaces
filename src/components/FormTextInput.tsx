import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {TextInput, TextInputProps, HelperText} from 'react-native-paper';
import {useController} from 'react-hook-form';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  control: any;
  name: string;
} & TextInputProps;

const FormTextInput = ({
  contentContainerStyle,
  control,
  name,
  ...otherProps
}: Props) => {
  const {
    field: {value, onChange, onBlur},
    fieldState: {invalid, error},
  } = useController({control, name});

  return (
    <View style={contentContainerStyle}>
      <TextInput
        value={value}
        error={invalid}
        onChangeText={onChange}
        onBlur={onBlur}
        {...otherProps}
      />

      {invalid && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default FormTextInput;
