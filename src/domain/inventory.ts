import { EntityResolver } from './resolver';

export type Inventory = {
  id: string;
  name: string;
  location: string;
  createdAt: string;
};

type InventoryRequired = Pick<Inventory, 'id' | 'name' | 'location'>;

const inventoryRequiredFieldMessages: Record<keyof InventoryRequired, string> =
  {
    id: 'El inventario tiene un id no definido',
    name: 'El nombre del inventario es requerido',
    location: 'La ubicación del inventario es requerida',
  };

export const inventoryResolver: EntityResolver<Inventory> = {
  entityName: 'inventory',
  resolver: (values: Inventory | Inventory[]) => {
    const isEmpty = (value: unknown): boolean =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && Number.isNaN(value));

    type FieldErrors = Partial<
      Record<keyof Inventory, { type: string; message: string }>
    >;

    if (Array.isArray(values)) {
      return { type: 'manual', message: '' };
    }

    const errors: FieldErrors = {};

    if (values && typeof values === 'object') {
      const requiredKeys = Object.keys(
        inventoryRequiredFieldMessages
      ) as (keyof typeof inventoryRequiredFieldMessages)[];

      for (const key of requiredKeys) {
        if (isEmpty(values[key])) {
          errors[key] = {
            type: 'manual',
            message: inventoryRequiredFieldMessages[key],
          };
        }
      }
    }
    return errors;
  },
};
