import { Inventory } from './inventory';
import { EntityResolver } from './resolver';

export type InventoryProduct = {
  id: string | undefined;
  name: string | undefined;
  salePrice: number | undefined;
  costPrice: number | undefined;
  description: string | undefined;
  isDiscontinued: boolean | undefined;
  createdAt: string | undefined;
  stok: number | undefined;
  inventory: Inventory | undefined;
};

type InventoryProductRequired = Pick<
  InventoryProduct,
  | 'id'
  | 'name'
  | 'salePrice'
  | 'costPrice'
  | 'isDiscontinued'
  | 'stok'
  | 'inventory'
>;

const inventoryProductRequiredFieldsMessages: Record<
  keyof InventoryProductRequired,
  string
> = {
  id: 'El producto de inventario tiene un id no definido',
  name: 'El nombre del producto es requerido',
  salePrice: 'El precio de venta del producto es requerido',
  costPrice: 'El precio de costo del producto es requerido',
  isDiscontinued: 'Debe especificar si el producto esta descontinuado',
  stok: 'El stok del producto es requerido',
  inventory: 'El inventario del producto es un campo requerido',
};

export const inventoryProductResolver: EntityResolver<InventoryProduct> = {
  entityName: 'inventoryProduct',
  resolver: (values: InventoryProduct | InventoryProduct[]) => {
    const isEmpty = (value: unknown): boolean =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    type FieldErrors = Partial<
      Record<keyof InventoryProduct, { type: string; message: string }>
    >;

    if (Array.isArray(values)) {
      return {
        type: 'manual',
        message: '',
      };
    }

    const errors: FieldErrors = {};

    if (values && typeof values === 'object') {
      const requiredKeys = Object.keys(
        inventoryProductRequiredFieldsMessages
      ) as (keyof typeof inventoryProductRequiredFieldsMessages)[];

      for (const key of requiredKeys) {
        if (isEmpty(values[key])) {
          errors[key] = {
            type: 'manual',
            message: inventoryProductRequiredFieldsMessages[key],
          };
        }
      }
    }
    return errors;
  },
};
