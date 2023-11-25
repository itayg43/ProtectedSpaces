import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import {useLocationContext} from '../contexts/locationContext';
import Modal from '../components/Modal';
import AddProtectedSpaceForm from '../components/forms/AddProtectedSpaceForm';

import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStack';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import {DEFAULT_MAP_DELTAS, DEFAULT_MAP_REGION} from '../utils/constants';

const ProtectedSpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const navigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocationContext();

  const {protectedSpaces} = useProtectedSpacesContext();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleMarkerPress = (id: string) => {
    navigation.navigate('protectedSpaceDetailsScreen', {
      id,
    });
  };

  const handleToggleShowAddModal = () => {
    setShowAddModal(currentState => !currentState);
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <MapView
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          region={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
                  longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
                }
              : DEFAULT_MAP_REGION
          }
          showsUserLocation>
          {location &&
            protectedSpaces.map(s => (
              <Marker
                key={s.id}
                coordinate={{
                  latitude: s.address.latLng.latitude,
                  longitude: s.address.latLng.longitude,
                }}
                onPress={() => handleMarkerPress(s.id)}
              />
            ))}
        </MapView>

        {location && (
          <FAB
            style={[styles.addFab, {bottom: safeAreaInsets.bottom || 20}]}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddModal}
          />
        )}

        {/** MODALS */}

        {showAddModal && (
          <Modal isVisible={showAddModal} onDismiss={handleToggleShowAddModal}>
            <AddProtectedSpaceForm
              contentContainerStyle={styles.addFormContainer}
              onSuccess={handleToggleShowAddModal}
            />
          </Modal>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProtectedSpacesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
  },

  addFab: {
    position: 'absolute',
    right: 20,
    borderRadius: 30,
  },

  addFormContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
