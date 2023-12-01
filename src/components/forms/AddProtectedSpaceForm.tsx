import React, {useMemo} from 'react';
import {Keyboard, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import type {AddProtectedSpaceFormData} from '../../utils/types';
import {addProtectedSpaceValidationSchema} from '../../utils/validationSchemas';
import {ProtectedSpaceType} from '../../utils/enums';
import FormImagesPicker from './FormImagesPicker';
import FormSegmentedButtons from './FormSegmentedButtons';
import FormGooglePlacesAutocomplete from './FormGooglePlacesAutocomplete';
import FormTextInput from './FormTextInput';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSubmit: (formData: AddProtectedSpaceFormData) => Promise<void>;
};

const AddProtectedSpaceForm = ({contentContainerStyle, onSubmit}: Props) => {
  const {control, handleSubmit, formState, setError} =
    useForm<AddProtectedSpaceFormData>({
      resolver: zodResolver(addProtectedSpaceValidationSchema),
      defaultValues: {
        images: [],
      },
    });

  const typeOptionButtons = useMemo(() => {
    return Object.entries(ProtectedSpaceType).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, []);

  return (
    <View style={[contentContainerStyle, styles.container]}>
      <FormImagesPicker<AddProtectedSpaceFormData>
        control={control}
        name="images"
        amount={3}
      />

      <FormSegmentedButtons<AddProtectedSpaceFormData>
        control={control}
        name="type"
        buttons={typeOptionButtons}
      />

      <FormGooglePlacesAutocomplete<AddProtectedSpaceFormData>
        control={control}
        name="address"
        placeholder="Address"
        onError={(message: string) => setError('address', {message})}
      />

      <FormTextInput<AddProtectedSpaceFormData>
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

export default AddProtectedSpaceForm;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
});
