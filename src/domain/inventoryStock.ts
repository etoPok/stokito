import { z } from 'zod';
import { SchemaInventory } from './inventory';

export const SchemaInventoryStock = z.object({
  id: z.string(),
  stock: z.number().positive(),
  inventory: SchemaInventory,
  createdAt: z.string(),
});

export type InventoryStock = z.infer<typeof SchemaInventoryStock>;
