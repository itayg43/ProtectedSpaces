import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import KeyboardAvoidingView from '../components/views/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddProtectedSpaceForm from '../components/forms/AddProtectedSpaceForm';
import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStackNavigator';
import {DEFAULT_MAP_DELTAS} from '../utils/constants';
import {ProtectedSpacesStackNavigationProp} from '../navigators/DrawerNavigator';
import type {AddProtectedSpaceFormData} from '../utils/types';
import errorAlert from '../utils/errorAlert';
import {useSafeAreaInsetsContext} from '../contexts/safeAreaInsetsContext';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import {useAuthContext} from '../contexts/authContext';
import protectedSpacesService from '../services/protectedSpacesService';
import useLocation from '../hooks/useLocation';

const ProtectedSpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsetsContext();

  const stackNavigation = useNavigation<ProtectedSpacesStackNavigationProp>();
  const screenNavigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocation();

  const {user} = useAuthContext();
  const {protectedSpaces} = useProtectedSpacesContext();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleMarkerPress = (id: string) => {
    screenNavigation.navigate('protectedSpaceDetailsScreen', {
      id,
    });
  };

  const handleOpenDrawer = () => {
    stackNavigation.openDrawer();
  };

  const handleToggleShowAddModal = () => {
    setShowAddModal(currentState => !currentState);
  };

  const handleSubmit = async (formData: AddProtectedSpaceFormData) => {
    if (!user) {
      return;
    }

    try {
      await protectedSpacesService.add(user, formData);
      handleToggleShowAddModal();
    } catch (error: any) {
      errorAlert.show(error.message);
    }
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
              : undefined
          }
          showsUserLocation>
          {protectedSpaces.map(s => (
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
          <AddProtectedSpaceForm
            contentContainerStyle={styles.addFormContainer}
            onSubmit={handleSubmit}
          />
        </Modal>
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
