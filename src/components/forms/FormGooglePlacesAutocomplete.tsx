import React from 'react';
import {View, StyleProp, ViewStyle, ScrollView, StyleSheet} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import {
  AddressComponent,
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
} from 'react-native-google-places-autocomplete';
import {FieldValues, useController, UseControllerProps} from 'react-hook-form';

import {GOOGLE_CLOUD_API_KEY} from '@env';

type Props<T extends FieldValues> = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onError: (message: string) => void;
} & Omit<GooglePlacesAutocompleteProps, 'query'> &
  UseControllerProps<T>;

const FormGooglePlacesAutocomplete = <T extends FieldValues>({
  contentContainerStyle,
  control,
  name,
  placeholder,
  onError,
}: Props<T>) => {
  const {
    field: {onChange},
    fieldState: {invalid, error},
  } = useController({control, name});

  const handlePress = (
    _: GooglePlaceData,
    details: GooglePlaceDetail | null,
  ) => {
    if (!details || !checkIfValidAddress(details.address_components)) {
      onError('Please select a valid address');
      return;
    }

    onChange({
      city: details.address_components[2].short_name,
      street: details.address_components[1].short_name,
      number: details.address_components[0].short_name,
      url: details.url,
      latLng: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
    });
  };

  return (
    <View style={contentContainerStyle}>
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          placeholder={placeholder}
          fetchDetails={true}
          onPress={handlePress}
          query={{
            key: GOOGLE_CLOUD_API_KEY,
            components: 'country:il',
          }}
          debounce={300}
          textInputProps={{
            InputComp: TextInput,
          }}
        />
      </ScrollView>

      {invalid && <HelperText type="error">{error?.message}</HelperText>}
    </View>
  );
};

export default FormGooglePlacesAutocomplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function checkIfValidAddress(addressComponent: AddressComponent[]) {
  if (addressComponent[0].types[0] !== 'street_number') {
    return false;
  }

  if (addressComponent[1].types[0] !== 'route') {
    return false;
  }

  if (addressComponent[2].types[0] !== 'locality') {
    return false;
  }

  return true;
}
