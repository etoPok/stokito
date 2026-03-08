import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/requiredFieldsValidator';
import { v4 as uuidv4 } from 'uuid';
import {
  InventoryProduct,
  inventoryProductRequiredFieldsMessages,
} from '../domain/inventoryProduct';
import { addProductToInventory } from '../services/repositories';
import { InventoryProductFormFields } from '../components/inventoryProductFormFields';
import { DefaultValues } from 'react-hook-form';

export const InventoryProductScreen = createEntityScreen<
  InventoryProduct,
  'InventoryProductScreen'
>({
  titleNew: 'Nuevo producto',
  titleView: 'Producto',

  resolver: createResolver(inventoryProductRequiredFieldsMessages),

  isNew: (route) => route.params.inventoryProduct === undefined,

  getDefaultValues: (route) =>
    route.params.inventoryProduct ??
    ({
      id: uuidv4(),
      name: undefined,
      description: undefined,
      sku: undefined,
      stok: undefined,
      costPrice: undefined,
      salePrice: undefined,
      inventory: undefined,
      isDiscontinued: false,
      createdAt: undefined,
    } satisfies DefaultValues<InventoryProduct>),

  save: async (values, route) => {
    if (route.params.inventoryProduct === undefined) {
      await addProductToInventory(
        values.id!,
        values.name!,
        values.salePrice!,
        values.costPrice!,
        values.description,
        values.isDiscontinued!,
        values.sku,
        values.stok!,
        values.inventory?.id!
      );
    } else {
      console.log('UPDATE');
    }
  },

  Fields: InventoryProductFormFields,
});
