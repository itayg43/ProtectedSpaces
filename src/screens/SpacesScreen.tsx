import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import KeyboardAvoidingView from '../components/views/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddSpaceForm from '../components/forms/AddSpaceForm';
import {SpacesScreenNavigationProp} from '../navigators/SpacesStackNavigator';
import {DEFAULT_MAP_DELTAS} from '../utils/constants';
import {SpacesStackNavigationProp} from '../navigators/DrawerNavigator';
import type {AddSpaceFormData} from '../utils/types';
import alert from '../utils/alert';
import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {useLocationContext} from '../contexts/locationContext';
import {useSpacesContext} from '../contexts/spacesContext';

const SpacesScreen = () => {
  const stackNavigation = useNavigation<SpacesStackNavigationProp>();
  const screenNavigation = useNavigation<SpacesScreenNavigationProp>();

  const safeAreaInsets = useSafeAreaInsetsContext();
  const {location} = useLocationContext();
  const {spaces, handleAddSpace} = useSpacesContext();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleMarkerPress = useCallback(
    (id: string) => {
      screenNavigation.navigate('spaceDetailsScreen', {
        id,
      });
    },
    [screenNavigation],
  );

  const handleOpenDrawer = () => {
    stackNavigation.openDrawer();
  };

  const handleToggleShowAddModal = () => {
    setShowAddModal(currentState => !currentState);
  };

  const handleSubmit = async (formData: AddSpaceFormData) => {
    try {
      await handleAddSpace(formData);
      handleToggleShowAddModal();
    } catch (error: any) {
      alert.error(error.message);
    }
  };

  const renderSpacesMarkers = useCallback(() => {
    return spaces.map(s => (
      <Marker
        key={s.id}
        coordinate={{
          latitude: s.latLng.latitude,
          longitude: s.latLng.longitude,
        }}
        onPress={() => handleMarkerPress(s.id)}
      />
    ));
  }, [spaces, handleMarkerPress]);

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
              : undefined
          }
          showsUserLocation>
          {renderSpacesMarkers()}
        </MapView>

        <FAB
          style={[styles.drawerFab, {top: safeAreaInsets.top}]}
          icon="menu"
          size="small"
          onPress={handleOpenDrawer}
        />

        <FAB
          style={[styles.addFab, {bottom: safeAreaInsets.bottom}]}
          icon="plus"
          size="medium"
          onPress={handleToggleShowAddModal}
        />

        {/** MODALS */}

        <Modal isVisible={showAddModal} onDismiss={handleToggleShowAddModal}>
          <AddSpaceForm
            contentContainerStyle={styles.addFormContainer}
            onSubmit={handleSubmit}
          />
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SpacesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
  },

  drawerFab: {
    position: 'absolute',
    left: 20,
    borderRadius: 30,
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
