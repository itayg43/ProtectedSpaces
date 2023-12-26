import React, {useState} from 'react';
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
import LoadingView from '../components/views/LoadingView';

const SpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const stackNavigation = useNavigation<SpacesStackNavigationProp>();
  const screenNavigation = useNavigation<SpacesScreenNavigationProp>();

  const locationContext = useLocationContext();
  const spacesContext = useSpacesContext();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleShowAddModal = () => {
    setShowAddModal(currentState => !currentState);
  };

  const handleSubmit = async (formData: AddSpaceFormData) => {
    try {
      await spacesContext?.handleAddSpace(formData);
      handleToggleShowAddModal();
    } catch (error: any) {
      alert.error(error.message);
    }
  };

  if (spacesContext?.status === 'loading') {
    return <LoadingView />;
  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        {renderMapSection()}

        <FAB
          style={[styles.drawerFab, {top: safeAreaInsets?.top}]}
          icon="menu"
          size="small"
          onPress={() => stackNavigation.openDrawer()}
        />

        <FAB
          style={[styles.addFab, {bottom: safeAreaInsets?.bottom}]}
          icon="plus"
          size="medium"
          onPress={handleToggleShowAddModal}
        />

        <Modal isVisible={showAddModal} onDismiss={handleToggleShowAddModal}>
          <AddSpaceForm
            contentContainerStyle={styles.addFormContainer}
            onSubmit={handleSubmit}
          />
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );

  function renderMapSection() {
    const handleMarkerPress = (id: string) => {
      screenNavigation.navigate('spaceDetailsScreen', {
        id,
      });
    };

    return (
      <MapView
        style={styles.mapContainer}
        provider={PROVIDER_GOOGLE}
        region={
          locationContext?.location
            ? {
                latitude: locationContext.location.latitude,
                longitude: locationContext.location.longitude,
                latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
                longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
              }
            : undefined
        }
        showsUserLocation>
        {spacesContext?.spaces.map(s => (
          <Marker
            key={s.id}
            coordinate={{
              latitude: s.latLng.latitude,
              longitude: s.latLng.longitude,
            }}
            onPress={() => handleMarkerPress(s.id)}
          />
        ))}
      </MapView>
    );
  }
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
