import {storageClient} from '../clients/firebaseClients';
import type {ImageAsset} from '../utils/types';

const uploadImage = async (image: ImageAsset, innerFolderName?: string) => {
  const ref = storageClient.ref(
    innerFolderName
      ? `/images/${innerFolderName}/${image.name}`
      : `/images/${image.name}`,
  );
  await ref.putFile(image.uri);
};

const uploadMultipleImages = async (
  images: ImageAsset[],
  innerFolderName?: string,
) => {
  await Promise.all(images.map(image => uploadImage(image, innerFolderName)));
};

const getImageUrl = async (image: ImageAsset, innerFolderName?: string) => {
  return await storageClient
    .ref(
      innerFolderName
        ? `/images/${innerFolderName}/${image.name}`
        : `/images/${image.name}`,
    )
    .getDownloadURL();
};

const getImagesUrls = async (
  images: ImageAsset[],
  innerFolderName?: string,
) => {
  return await Promise.all(
    images.map(image => getImageUrl(image, innerFolderName)),
  );
};

export default {
  uploadImage,
  uploadMultipleImages,
  getImageUrl,
  getImagesUrls,
};
