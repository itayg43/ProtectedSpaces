import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import KeyboardAvoidingView from '../components/KeyboardAvoidingView';
import Modal from '../components/Modal';
import AddProtectedSpaceForm from '../components/forms/AddProtectedSpaceForm';
import {ProtectedSpacesScreenNavigationProp} from '../navigators/ProtectedSpacesStackNavigator';
import {DEFAULT_MAP_DELTAS} from '../utils/constants';
import {ProtectedSpacesStackNavigationProp} from '../navigators/DrawerNavigator';
import useLocation from '../hooks/useLocation';
import type {AddProtectedSpaceFormData, ProtectedSpace} from '../utils/types';
import protectedSpacesService from '../services/protectedSpacesService';
import log from '../utils/log';
import {useAuthContext} from '../contexts/authContext';
import errorAlert from '../utils/errorAlert';

const ProtectedSpacesScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const topInset = safeAreaInsets.top > 20 ? safeAreaInsets.top : 30;
  const bottomInset = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20;

  const stackNavigation = useNavigation<ProtectedSpacesStackNavigationProp>();
  const screenNavigation = useNavigation<ProtectedSpacesScreenNavigationProp>();

  const location = useLocation();

  const {user} = useAuthContext();

  const [protectedSpaces, setProtectedSpaces] = useState<ProtectedSpace[]>([]);

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

  const handleSubmitProtectedSpace = async (
    formData: AddProtectedSpaceFormData,
  ) => {
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

  useEffect(() => {
    const unsubscribe = protectedSpacesService.collectionSubscription(
      s => setProtectedSpaces(s),
      e => log.error(e),
    );

    return unsubscribe;
  }, []);

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
              style={[styles.drawerFab, {top: topInset}]}
              icon="menu"
              size="small"
              onPress={handleOpenDrawer}
            />

            <FAB
              style={[styles.addFab, {bottom: bottomInset}]}
              icon="plus"
              size="medium"
              onPress={handleToggleShowAddModal}
            />

            {/** MODALS */}

            <Modal
              isVisible={showAddModal}
              onDismiss={handleToggleShowAddModal}>
              <AddProtectedSpaceForm
                contentContainerStyle={styles.addFormContainer}
                onSubmit={handleSubmitProtectedSpace}
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
