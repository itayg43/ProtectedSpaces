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

import type {AddCommentFormData} from '../../utils/types';
import {addCommentValidationSchema} from '../../utils/validationSchemas';
import {useProtectedSpacesContext} from '../../contexts/protectedSpacesContext';
import FormTextInput from './FormTextInput';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSuccess: () => void;
};

const AddCommentForm = ({contentContainerStyle, onSuccess}: Props) => {
  const {handleAddComment} = useProtectedSpacesContext();

  const {
    control,
    handleSubmit: onSubmit,
    formState,
  } = useForm<AddCommentFormData>({
    resolver: zodResolver(addCommentValidationSchema),
  });

  const handleSubmit = async (formData: AddCommentFormData) => {
    try {
      Keyboard.dismiss();
      await handleAddComment(formData);
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

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
        onPress={onSubmit(handleSubmit)}
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
