import React from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Button, SegmentedButtons, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {GOOGLE_CLOUD_API_KEY} from '@env';
import FormTextInput from './FormTextInput';

const PROTECTED_SPACE_TYPES = [
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
  type: z.string(),

  address: z.object({
    value: z.string(),
    coordinate: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),

  description: z.string({
    required_error: 'Required',
  }),
});

export type AddProtectedSpaceFormData = z.infer<
  typeof addProtectedSpaceFormSchema
>;

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onSubmit: (formData: AddProtectedSpaceFormData) => void;
};

const AddProtectedSpaceForm = ({contentContainerStyle, onSubmit}: Props) => {
  const {
    control,
    handleSubmit,
    formState: {isSubmitting},
  } = useForm<AddProtectedSpaceFormData>({
    resolver: zodResolver(addProtectedSpaceFormSchema),
    defaultValues: {
      type: PROTECTED_SPACE_TYPES[0].value,
    },
  });

  return (
    <View style={[contentContainerStyle, styles.container]}>
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

      <ScrollView contentContainerStyle={styles.addressContainer} horizontal>
        <Controller
          name="address"
          control={control}
          render={({field: {onChange}}) => (
            <GooglePlacesAutocomplete
              placeholder="Address"
              fetchDetails={true}
              onPress={(_, details) => {
                onChange({
                  value: details?.name,
                  coordinate: {
                    latitude: details?.geometry.location.lat,
                    longitude: details?.geometry.location.lng,
                  },
                });
              }}
              query={{
                key: GOOGLE_CLOUD_API_KEY,
                components: 'country:il',
              }}
              debounce={300}
              textInputProps={{
                InputComp: TextInput,
              }}
            />
          )}
        />
      </ScrollView>

      <FormTextInput
        control={control}
        name="description"
        label="Description"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}>
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
  addressContainer: {
    flex: 1,
  },
});
