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
import LoadingView from '../components/views/LoadingView';

const SpacesScreen = () => {
  const stackNavigation = useNavigation<SpacesStackNavigationProp>();
  const screenNavigation = useNavigation<SpacesScreenNavigationProp>();

  const safeAreaInsetsContext = useSafeAreaInsetsContext();
  const locationContext = useLocationContext();
  const spacesContext = useSpacesContext();

  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    stackNavigation.openDrawer();
  }, [stackNavigation]);

  const handleToggleShowAddSpaceModal = () => {
    setShowAddSpaceModal(currentState => !currentState);
  };

  const handleSubmitSpace = async (formData: AddSpaceFormData) => {
    try {
      await spacesContext.addSpace(formData);
      handleToggleShowAddSpaceModal();
    } catch (error: any) {
      alert.error(error?.message);
    }
  };

  const handleMapMarkerPress = (spaceId: string) => {
    screenNavigation.navigate('spaceDetailsScreen', {
      id: spaceId,
    });
  };

  if (spacesContext.getSpacesStatus === 'loading') {
    return <LoadingView />;
  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <MapView
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          region={
            locationContext.location
              ? {
                  latitude: locationContext.location.latitude,
                  longitude: locationContext.location.longitude,
                  latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
                  longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
                }
              : undefined
          }
          showsUserLocation>
          {spacesContext.spaces.map(s => (
            <Marker
              key={s.id}
              coordinate={{
                latitude: s.latLng.latitude,
                longitude: s.latLng.longitude,
              }}
              onPress={() => handleMapMarkerPress(s.id)}
            />
          ))}
        </MapView>

        {locationContext.location && (
          <FAB
            style={[styles.drawerFab, {top: safeAreaInsetsContext.top}]}
            icon="menu"
            size="small"
            onPress={handleOpenDrawer}
          />
        )}

        {locationContext.location && (
          <FAB
            style={[styles.addFab, {bottom: safeAreaInsetsContext.bottom}]}
            icon="plus"
            size="medium"
            onPress={handleToggleShowAddSpaceModal}
          />
        )}

        <Modal
          isVisible={showAddSpaceModal}
          onDismiss={handleToggleShowAddSpaceModal}>
          <AddSpaceForm
            contentContainerStyle={styles.addSpaceFormContainer}
            onSubmit={handleSubmitSpace}
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

  addSpaceFormContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
});
