import React from 'react';
import {View, StyleProp, ViewStyle, ScrollView, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useController} from 'react-hook-form';

import {GOOGLE_CLOUD_API_KEY} from '@env';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  control: any;
  name: string;
  placeholder: string;
};

const FormGooglePlacesAutocomplete = ({
  contentContainerStyle,
  control,
  name,
  placeholder,
}: Props) => {
  const {
    field: {onChange},
  } = useController({control, name});

  return (
    <View style={contentContainerStyle}>
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        keyboardShouldPersistTaps="handled">
        <GooglePlacesAutocomplete
          placeholder={placeholder}
          fetchDetails={true}
          onPress={(_, details) => {
            onChange({
              city: details?.address_components[2].short_name,
              street: details?.address_components[1].short_name,
              buildingNumber: details?.address_components[0].short_name,
              googleMapsLinkUrl: details?.url,
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
      </ScrollView>
    </View>
  );
};

export default FormGooglePlacesAutocomplete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
