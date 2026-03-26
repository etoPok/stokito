import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/resolver';
import { v4 as uuidv4 } from 'uuid';
import {
  InventoryFormFields,
  InventoryFormFIeldsType,
} from '../components/inventoryFormFields';
import { useInventories } from '../hooks/inventoryContext';
import { inventoryResolver } from '../domain/inventory';

export function InventoryScreen() {
  const { addInventory } = useInventories();

  return createEntityScreen<InventoryFormFIeldsType, 'InventoryScreen'>({
    titleNew: 'Nuevo inventario',
    titleView: 'Inventario',

    resolver: createResolver([inventoryResolver]),

    isNew: (route) => route.params.inventory === undefined,

    getDefaultValues: async (route) => {
      if (route.params.inventory) {
        return { inventory: route.params.inventory };
      } else {
        return {
          inventory: {
            id: uuidv4(),
            name: undefined,
            location: undefined,
            createdAt: undefined,
          },
        };
      }
    },

    save: async (values, route) => {
      if (route.params.inventory === undefined) {
        await addInventory({
          id: values.inventory.id,
          name: values.inventory.name,
          location: values.inventory.location,
          createdAt: '',
        });
      } else {
        console.log('UPDATE');
      }
    },

    Fields: InventoryFormFields,
  })();
}
