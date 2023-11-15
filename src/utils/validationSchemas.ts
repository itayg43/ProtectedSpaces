import * as z from 'zod';

import {ProtectedSpaceType} from './enums';

export const addProtectedSpaceValidationSchema = z.object({
  images: z
    .object({
      name: z.string(),
      uri: z.string(),
    })
    .array()
    .nonempty(),

  type: z.nativeEnum(ProtectedSpaceType),

  address: z.object({
    city: z.string(),
    street: z.string(),
    buildingNumber: z.string(),
    googleMapsLinkUrl: z.string(),
    coordinate: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),

  description: z.string(),
});
