import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, SegmentedButtons} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormTextInput from './FormTextInput';

type ProtectedSpaceType = {
  label: string;
  value: string;
};

const PROTECTED_SPACE_TYPES: ProtectedSpaceType[] = [
  {
    label: 'Shelter',
    value: 'shelter',
  },
  {
    label: 'Stairway',
    value: 'stairway',
  },
];

const addProtectedSpaceFormSchema = z.object({
  type: z.string({
    required_error: 'Required',
  }),

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
    defaultValues: {
      type: PROTECTED_SPACE_TYPES[0].value,
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        name="type"
        control={control}
        render={({field: {value, onChange}}) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={PROTECTED_SPACE_TYPES}
          />
        )}
      />

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
