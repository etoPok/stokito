import { CreateEntityScreen } from '../components/createEntityScreen';
import { InventoryFormFields } from '../components/inventoryFormFields';
import { useCreateInventory, useUpdateInventory } from '../hooks/useInventory';
import { Inventory, SchemaInventory } from '../domain/inventory';
import { zodResolver } from '@hookform/resolvers/zod';

export function InventoryScreen() {
  const { mutateAsync: createInventory } = useCreateInventory();
  const { mutateAsync: updateInventory } = useUpdateInventory();

  return (
    <CreateEntityScreen<Inventory, 'InventoryScreen'>
      titleNew="Nuevo inventario"
      titleView="Inventario"
      resolver={zodResolver(SchemaInventory)}
      isNew={(route) => route.params.inventory === undefined}
      getDefaultValues={async (route) => {
        return route.params.inventory === undefined
          ? {
              id: '',
              name: undefined,
              location: undefined,
              createdAt: '',
            }
          : route.params.inventory;
      }}
      handleNewEntity={async (values, route) => {
        try {
          await createInventory({
            name: values.name,
            location: values.location,
          });
        } catch (error) {
          console.log(error);
        }
      }}
      handleEntityUpdate={async (values, route) => {
        try {
          await updateInventory({
            id: values.id,
            changes: {
              name: values.name,
              location: values.location,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }}
      Fields={InventoryFormFields}
    />
  );
}
