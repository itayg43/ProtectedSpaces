import {storageClient} from '../clients/firebaseClients';
import type {ImageAsset} from '../utils/types';

const uploadImage = async (image: ImageAsset) => {
  const ref = storageClient.ref(`/images/${image.name}`);
  await ref.putFile(image.uri);
};

const getImageUrl = async (imageName: string) => {
  return await storageClient.ref(`/images/${imageName}`).getDownloadURL();
};

export default {
  uploadImage,
  getImageUrl,
};
