import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {SegmentedButtons, HelperText} from 'react-native-paper';
import {useController} from 'react-hook-form';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  control: any;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
};

const FormSegmentedButtons = ({
  contentContainerStyle,
  control,
  name,
  options,
}: Props) => {
  const {
    field: {value, onChange},
    fieldState: {invalid, error},
  } = useController({control, name});

  return (
    <View style={contentContainerStyle}>
      <SegmentedButtons
        value={value}
        onValueChange={onChange}
        buttons={options}
      />

      {invalid && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default FormSegmentedButtons;
