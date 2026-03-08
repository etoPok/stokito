import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/requiredFieldsValidator';
import { v4 as uuidv4 } from 'uuid';
import { setInventory } from '../services/repositories';
import { Inventory, inventoryRequiredFieldMessages } from '../domain/inventory';
import { InventoryFormFields } from '../components/inventoryFormFields';
import { DefaultValues } from 'react-hook-form';

export const InventoryScreen = createEntityScreen<Inventory, 'InventoryScreen'>(
  {
    titleNew: 'Nuevo inventario',
    titleView: 'Inventario',

    resolver: createResolver(inventoryRequiredFieldMessages),

    isNew: (route) => route.params.inventory === undefined,

    getDefaultValues: (route) =>
      route.params.inventory ??
      ({
        id: uuidv4(),
        name: undefined,
        location: undefined,
        date: undefined,
      } satisfies DefaultValues<Inventory>),

    save: async (values, route) => {
      if (route.params.inventory === undefined) {
        await setInventory(values.id!, values.name!, values.location!);
      } else {
        console.log('UPDATE');
      }
    },

    Fields: InventoryFormFields,
  }
);
