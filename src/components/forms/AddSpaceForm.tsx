import React, {useMemo} from 'react';
import {Keyboard, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import type {AddSpaceFormData} from '../../utils/types';
import {addSpaceValidationSchema} from '../../utils/validationSchemas';
import {SpaceType} from '../../utils/enums';
import FormImagesPicker from './FormImagesPicker';
import FormSegmentedButtons from './FormSegmentedButtons';
import FormGooglePlacesAutocomplete from './FormGooglePlacesAutocomplete';
import FormTextInput from './FormTextInput';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSubmit: (formData: AddSpaceFormData) => Promise<void>;
};

const AddSpaceForm = ({contentContainerStyle, onSubmit}: Props) => {
  const {control, handleSubmit, formState, setError} =
    useForm<AddSpaceFormData>({
      resolver: zodResolver(addSpaceValidationSchema),
      defaultValues: {
        images: [],
      },
    });

  const typeOptionButtons = useMemo(() => {
    return Object.entries(SpaceType).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, []);

  return (
    <View style={[contentContainerStyle, styles.container]}>
      <FormImagesPicker<AddSpaceFormData>
        control={control}
        name="images"
        amount={3}
      />

      <FormSegmentedButtons<AddSpaceFormData>
        control={control}
        name="type"
        buttons={typeOptionButtons}
      />

      <FormGooglePlacesAutocomplete<AddSpaceFormData>
        control={control}
        name="address"
        placeholder="Address"
        onError={(message: string) => setError('address', {message})}
      />

      <FormTextInput<AddSpaceFormData>
        control={control}
        name="description"
        label="Description"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit(async formData => {
          Keyboard.dismiss();
          await onSubmit(formData);
        })}
        loading={formState.isSubmitting}
        disabled={formState.isSubmitting}>
        Submit
      </Button>
    </View>
  );
};

export default AddSpaceForm;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
});
