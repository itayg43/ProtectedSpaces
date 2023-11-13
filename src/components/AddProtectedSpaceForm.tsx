import React from 'react';
import {
  Alert,
  Keyboard,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import FormTextInput from './FormTextInput';
import FormSegmentedButtons from './FormSegmentedButtons';
import FormGooglePlacesAutocomplete from './FormGooglePlacesAutocomplete';
import type {AddProtectedSpaceFormData} from '../utils/types';
import {addProtectedSpaceValidationSchema} from '../utils/validationSchemas';
import {PROTECTED_SPACE_TYPE_OPTIONS} from '../utils/constants';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import log from '../utils/log';
import FormImagePicker from './FormImagePicker';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSuccess: () => void;
};

const AddProtectedSpaceForm = ({contentContainerStyle, onSuccess}: Props) => {
  const {handleAddProtectedSpace} = useProtectedSpacesContext();

  const {
    control,
    handleSubmit: onSubmit,
    formState,
  } = useForm<AddProtectedSpaceFormData>({
    resolver: zodResolver(addProtectedSpaceValidationSchema),
  });

  const handleSubmit = async (formData: AddProtectedSpaceFormData) => {
    try {
      Keyboard.dismiss();
      await handleAddProtectedSpace(formData);
      onSuccess();
    } catch (error: any) {
      log.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[contentContainerStyle, styles.container]}>
      <FormImagePicker control={control} name="image" />

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
        onPress={onSubmit(handleSubmit)}
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
