import {storageClient} from '../clients/firebaseClients';
import type {ImageAsset} from '../utils/types';

const uploadImage = async (image: ImageAsset) => {
  const ref = storageClient.ref(`/images/${image.name}`);
  await ref.putFile(image.uri);
};

const uploadMultipleImages = async (images: ImageAsset[]) => {
  await Promise.all(images.map(image => uploadImage(image)));
};

const getImageUrl = async (image: ImageAsset) => {
  return await storageClient.ref(`/images/${image.name}`).getDownloadURL();
};

const getImagesUrls = async (images: ImageAsset[]) => {
  return await Promise.all(images.map(image => getImageUrl(image)));
};

export default {
  uploadImage,
  uploadMultipleImages,
  getImageUrl,
  getImagesUrls,
};
