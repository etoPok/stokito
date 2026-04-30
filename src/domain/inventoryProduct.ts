import { z } from 'zod';
import { SchemaProductDefinition } from './productDefinition';
import { SchemaProductCode } from './productCode';
import { SchemaInventoryStock } from './inventoryStock';

export const SchemaInventoryProduct = SchemaProductDefinition.extend({
  productId: z.string(),
  inventoryStock: SchemaInventoryStock,
  codes: z.array(SchemaProductCode),
});

export type InventoryProduct = z.infer<typeof SchemaInventoryProduct>;
