import * as z from 'zod';

import {ProtectedSpaceType} from './enums';

export const addProtectedSpaceValidationSchema = z.object({
  images: z
    .object({
      name: z.string(),
      uri: z.string(),
    })
    .array()
    .nonempty('Please select at least one image'),

  type: z.nativeEnum(ProtectedSpaceType),

  address: z.object({
    city: z.string(),
    street: z.string(),
    number: z.string(),
    url: z.string(),
    latLng: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),

  description: z.string(),
});
