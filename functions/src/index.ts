/* eslint-disable require-jsdoc */
/* eslint-disable quotes */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteImages = functions.firestore
  .document('spaces/{id}')
  .onDelete(async (_, context) => {
    try {
      const {id} = context.params;

      console.log(`Delete images of space with the id: ${id}`);

      await admin
        .storage()
        .bucket()
        .deleteFiles({
          prefix: `images/${id}`,
        });
    } catch (error) {
      console.error(error);
    }
  });
