import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import FormTextInput from './FormTextInput';
import FormSegmentedButtons from './FormSegmentedButtons';
import FormGooglePlacesAutocomplete from './FormGooglePlacesAutocomplete';
import type {AddProtectedSpaceFormData} from '../utils/types';
import {addProtectedSpaceValidationSchema} from '../utils/validationSchemas';
import {PROTECTED_SPACE_TYPE_OPTIONS} from '../utils/constants';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSubmit: (formData: AddProtectedSpaceFormData) => void;
};

const AddProtectedSpaceForm = ({contentContainerStyle, onSubmit}: Props) => {
  const {control, handleSubmit, formState} = useForm<AddProtectedSpaceFormData>(
    {resolver: zodResolver(addProtectedSpaceValidationSchema)},
  );

  return (
    <View style={[contentContainerStyle, styles.container]}>
      <FormSegmentedButtons
        control={control}
        name="type"
        options={PROTECTED_SPACE_TYPE_OPTIONS}
      />

      <FormGooglePlacesAutocomplete
        control={control}
        name="address"
        placeholder="Address"
      />

      <FormTextInput
        control={control}
        name="description"
        label="Description"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={formState.isSubmitting}
        disabled={!formState.isValid}>
        Submit
      </Button>
    </View>
  );
};

export default AddProtectedSpaceForm;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
