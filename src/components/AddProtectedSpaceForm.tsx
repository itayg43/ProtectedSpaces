import React, {useMemo} from 'react';
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

import {
  FormTextInput,
  FormImagesPicker,
  FormGooglePlacesAutocomplete,
  FormSegmentedButtons,
} from './forms';
import type {AddProtectedSpaceFormData} from '../utils/types';
import {addProtectedSpaceValidationSchema} from '../utils/validationSchemas';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import log from '../utils/log';

import {ProtectedSpaceType} from '../utils/enums';

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
    setError,
  } = useForm<AddProtectedSpaceFormData>({
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
      <FormImagesPicker<AddProtectedSpaceFormData>
        control={control}
        name="images"
        amount={5}
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
        onPress={onSubmit(handleSubmit)}
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
