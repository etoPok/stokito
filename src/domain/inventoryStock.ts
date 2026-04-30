import { Inventory } from './inventory';
import { EntityResolver } from './resolver';

export type InventoryStock = {
  id: string | undefined;
  stock: number | undefined;
  inventory: Inventory | undefined;
  createdAt: string | undefined;
};

type InventoryProductRequired = Pick<InventoryStock, 'stock' | 'inventory'>;

const inventoryProductRequiredFieldsMessages: Record<
  keyof InventoryProductRequired,
  string
> = {
  stock: 'El stok del producto es requerido',
  inventory: 'El inventario del producto es un campo requerido',
};

export const inventoryProductResolver: EntityResolver<InventoryStock> = {
  entityName: 'inventoryProduct',
  resolver: (values: InventoryStock | InventoryStock[]) => {
    const isEmpty = (value: unknown): boolean =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    type FieldErrors = Partial<
      Record<keyof InventoryStock, { type: string; message: string }>
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
