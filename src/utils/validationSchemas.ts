import * as z from 'zod';

import {ProtectedSpaceType} from './enums';

export const addProtectedSpaceValidationSchema = z.object({
  image: z.object({
    name: z.string(),
    uri: z.string(),
  }),

  type: z.nativeEnum(ProtectedSpaceType),

  address: z.object({
    value: z.string(),
    coordinate: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),

  description: z.string(),
});
