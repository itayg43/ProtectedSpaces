import React from 'react';
import {Keyboard, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {FormTextInput} from './forms';
import type {AddCommentFormData} from '../utils/types';
import {addCommentValidationSchema} from '../utils/validationSchemas';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSubmit: (formData: AddCommentFormData) => Promise<void>;
};

const AddCommentForm = ({contentContainerStyle, onSubmit}: Props) => {
  const {control, handleSubmit, formState, reset} = useForm<AddCommentFormData>(
    {resolver: zodResolver(addCommentValidationSchema)},
  );

  return (
    <View style={[contentContainerStyle, styles.container]}>
      <FormTextInput<AddCommentFormData>
        control={control}
        name="value"
        label="Comment"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit(async formData => {
          Keyboard.dismiss();
          await onSubmit(formData);
          reset({value: ''});
        })}
        loading={formState.isSubmitting}
        disabled={formState.isSubmitting}>
        Submit
      </Button>
    </View>
  );
};

export default AddCommentForm;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
});
