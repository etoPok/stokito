import { z } from 'zod';

export const SchemaProductCode = z.object({
  id: z.string(),
  code: z.string(),
  codeType: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.string(),
});

export type ProductCode = z.infer<typeof SchemaProductCode>;
