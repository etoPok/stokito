import { Inventory } from './inventory';
import { InventoryStock } from './inventoryStock';
import { ProductDefinition } from './productDefinition';
import { ProductCode } from './productCode';
import { ProductVariant } from './productVariant';
import { EntityResolver } from './resolver';

export type InventoryProduct = ProductDefinition &
  InventoryStock & {
    productVariants: ProductVariant[];
    inventory: Inventory;
    productCodes: ProductCode[];
  };

type InventoryProductRequired = Pick<
  InventoryProduct,
  'name' | 'stock' | 'productVariants' | 'inventory' | 'productCodes'
>;

const inventoryProductRequiredFieldsMessages: Record<
  keyof InventoryProductRequired,
  string
> = {
  name: 'El nombre del producto es un campo requerido',
  stock: 'El stok del producto es un campo requerido',
  productVariants: 'El producto debe tener a lo menos una variante',
  inventory: 'El inventario es un campo requerido',
  productCodes: 'El producto debe tener a lo menos un codigo',
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
