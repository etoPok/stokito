import { EntityResolver } from './resolver';

export type Product = {
  id: string | undefined;
  name: string | undefined;
  salePrice: number | undefined;
  costPrice: number | undefined;
  description: string | undefined;
  isDiscontinued: boolean | undefined;
  createdAt: string | undefined;
};

type ProductRequired = Pick<
  Product,
  'id' | 'name' | 'salePrice' | 'costPrice' | 'isDiscontinued'
>;

const productRequiredFieldMessages: Record<keyof ProductRequired, string> = {
  id: 'El producto tiene un id no definido',
  name: 'El nombre del producto es requerido',
  salePrice: 'El precio de venta del producto es requerido',
  costPrice: 'El precio de costo del producto es requerido',
  isDiscontinued: 'Debe especificar si el producto esta descontinuado',
};

export const productResolver: EntityResolver<Product> = {
  entityName: 'product',
  resolver: (values: Product | Product[]) => {
    const isEmpty = (value: unknown): boolean =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    type FieldErrors = Partial<
      Record<keyof Product, { type: string; message: string }>
    >;

    if (Array.isArray(values)) {
      return { type: 'manual', message: '' };
    }

    const errors: FieldErrors = {};

    if (values && typeof values === 'object') {
      const requiredKeys = Object.keys(
        productRequiredFieldMessages
      ) as (keyof typeof productRequiredFieldMessages)[];

      for (const key of requiredKeys) {
        if (isEmpty(values[key])) {
          errors[key] = {
            type: 'manual',
            message: productRequiredFieldMessages[key],
          };
        }
      }
    }
    return errors;
  },
};
