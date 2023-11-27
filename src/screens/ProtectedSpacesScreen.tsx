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
import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStackNavigator';
import {useProtectedSpacesContext} from '../contexts/protectedSpacesContext';
import {DEFAULT_MAP_DELTAS} from '../utils/constants';
import {ProtectedSpacesStackNavigationProp} from '../navigators/DrawerNavigator';

const ProtectedSpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const stackNavigation = useNavigation<ProtectedSpacesStackNavigationProp>();
  const screenNavigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocationContext();

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

  return (
    <>
      {location && (
        <KeyboardAvoidingView>
          <View style={styles.container}>
            <MapView
              style={styles.mapContainer}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: DEFAULT_MAP_DELTAS.LATITUDE,
                longitudeDelta: DEFAULT_MAP_DELTAS.LONGITUDE,
              }}
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
              style={[styles.drawerFab, {top: safeAreaInsets.top || 20}]}
              icon="menu"
              size="small"
              onPress={handleOpenDrawer}
            />

            <FAB
              style={[styles.addFab, {bottom: safeAreaInsets.bottom || 20}]}
              icon="plus"
              size="small"
              onPress={handleToggleShowAddModal}
            />

            {/** MODALS */}

            <Modal
              isVisible={showAddModal}
              onDismiss={handleToggleShowAddModal}>
              <AddProtectedSpaceForm
                contentContainerStyle={styles.addFormContainer}
                onSuccess={handleToggleShowAddModal}
              />
            </Modal>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
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
