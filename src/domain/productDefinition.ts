import { z } from 'zod';

export const SchemaProductDefinition = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, 'El nombre no puede estar vacio')
    .max(15, 'El nombre debe tener como maximo 15 caracteres'),
  description: z.string().max(40),
  salePrice: z.number().positive(),
  costPrice: z.number().positive(),
  isDiscontinued: z.boolean(),
  createdAt: z.string(),
});

export type ProductDefinition = z.infer<typeof SchemaProductDefinition>;
