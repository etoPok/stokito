import { SchemaProductCode } from './productCode';
import { SchemaProductDefinition } from './productDefinition';
import { z } from 'zod';

export const SchemaProduct = SchemaProductDefinition.extend({
  codes: z.array(SchemaProductCode),
});

export type Product = z.infer<typeof SchemaProduct>;
