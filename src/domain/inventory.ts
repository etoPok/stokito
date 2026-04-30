import { z } from 'zod';

export const SchemaInventory = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, 'El nombre no puede estar vacio')
    .max(15, 'El nombre debe tener como maximo 15 caracteres'),
  location: z
    .string()
    .trim()
    .min(1, 'La ubicación no puede estar vacia')
    .max(15, 'La ubicación debe tener un maximo de 15 caracteres'),
  createdAt: z.string(),
});

export type Inventory = z.infer<typeof SchemaInventory>;
