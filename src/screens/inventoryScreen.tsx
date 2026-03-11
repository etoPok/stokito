import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/requiredFieldsValidator';
import { v4 as uuidv4 } from 'uuid';
import { Inventory, inventoryRequiredFieldMessages } from '../domain/inventory';
import { InventoryFormFields } from '../components/inventoryFormFields';
import { DefaultValues } from 'react-hook-form';
import { useInventories } from '../hooks/inventoryContext';

export function InventoryScreen() {
  const { addInventory } = useInventories();

  return createEntityScreen<Inventory, 'InventoryScreen'>({
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
        createdAt: undefined,
      } satisfies DefaultValues<Inventory>),

    save: async (values, route) => {
      if (route.params.inventory === undefined) {
        await addInventory({
          id: values.id,
          name: values.name,
          location: values.location,
          createdAt: '',
        });
      } else {
        console.log('UPDATE');
      }
    },

    Fields: InventoryFormFields,
  })();
}
