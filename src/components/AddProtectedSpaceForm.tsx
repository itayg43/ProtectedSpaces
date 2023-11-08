import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormTextInput from './FormTextInput';

enum ProtectedSpaceType {
  Shelter = 'shelter',
  Stairway = 'stairway',
}

const addProtectedSpaceFormSchema = z.object({
  type: z.nativeEnum(ProtectedSpaceType),

  address: z.string({
    required_error: 'Required',
  }),

  description: z.string({
    required_error: 'Required',
  }),
});

type AddProtectedSpaceFormSchema = z.infer<typeof addProtectedSpaceFormSchema>;

type Props = {
  onSubmit: (addProtectedSpaceFormData: AddProtectedSpaceFormSchema) => void;
};

const AddProtectedSpaceForm = ({onSubmit}: Props) => {
  const {control, handleSubmit} = useForm<AddProtectedSpaceFormSchema>({
    resolver: zodResolver(addProtectedSpaceFormSchema),
  });

  return (
    <View style={styles.container}>
      <FormTextInput
        control={control}
        name="description"
        label="Description"
        multiline
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
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
