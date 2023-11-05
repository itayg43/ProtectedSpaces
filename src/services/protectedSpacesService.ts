import firestore from '@react-native-firebase/firestore';

import type {ProtectedSpaceFormData, ProtectedSpace} from '../utils/types';

const protectedSpacesCollection = firestore().collection('ProtectedSpaces');

const add = async (spaceFormData: ProtectedSpaceFormData) => {
  await protectedSpacesCollection.add({
    ...spaceFormData,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

const collectionSubscription = (
  onChangeCallback: (spaces: ProtectedSpace[]) => void,
) => {
  return protectedSpacesCollection.onSnapshot(query => {
    const spaces: ProtectedSpace[] = [];

    query.forEach(document => {
      spaces.push({
        ...document.data(),
        id: document.id,
      } as ProtectedSpace);
    });

    onChangeCallback(spaces);
  });
};

export default {
  add,
  collectionSubscription,
};

// const data: ProtectedSpaceFormData[] = [
//   {
//     address: 'Bnei ephraim 280',
//     description: 'Stairway, enter #2580 at the intercom.',
//     imageUrl:
//       'https://assets-global.website-files.com/6040dc55ca42f6fbf1b0ab17/63232ff325fcc0773cced5cf_bulletins%252FWhatsApp%2520Image%25202022-09-15%2520at%25202.48.51%2520PM-41e7fcc4-751a-4f2b-86ee-3c2847448dd0.webp',
//     coordinate: new firestore.GeoPoint(32.122668, 34.823412),
//   },
//   {
//     address: 'Ir shemesh 43',
//     description: 'Bomb shelter, open 24/7 at war.',
//     imageUrl:
//       'https://medias.timeout.co.il/www/uploads/2014/07/800px-AirRaidShelterHolon02_T-1140x641.jpg',
//     coordinate: new firestore.GeoPoint(32.12434899312899, 34.82692514590521),
//   },
// ];
