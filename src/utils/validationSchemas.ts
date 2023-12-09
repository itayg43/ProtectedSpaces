import * as z from 'zod';

import {SpaceType} from './enums';

export const addSpaceValidationSchema = z.object({
  images: z
    .object({
      name: z.string(),
      uri: z.string(),
    })
    .array()
    .nonempty('Please select at least one image'),

  type: z.nativeEnum(SpaceType),

  address: z.object({
    id: z.string(),
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

export const addCommentValidationSchema = z.object({
  value: z.string(),
});
