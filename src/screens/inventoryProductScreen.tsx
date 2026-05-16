import { CreateEntityScreen } from '../components/createEntityScreen';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  InventoryProduct,
  SchemaInventoryProduct,
} from '../domain/inventoryProduct';
import { InventoryProductFormFields } from '../components/inventoryProductFormFields';
import {
  useCreateInventoryProduct,
  useUpdateInventoryProduct,
} from '../hooks/useInventoryProduct';
import { useAddProductToInventory } from '../hooks/useAddProductToInventory';
import { isProductInInventory } from '../services/repoInventoryProduct';

export function InventoryProductScreen() {
  const { mutateAsync: createInventoryProduct } = useCreateInventoryProduct();
  const { mutateAsync: updateInventoryProduct } = useUpdateInventoryProduct();
  const { mutateAsync: addToInventory } = useAddProductToInventory();

  return (
    <CreateEntityScreen<InventoryProduct, 'InventoryProductScreen'>
      titleNew="Nuevo producto"
      titleView="Producto"
      resolver={zodResolver(SchemaInventoryProduct)}
      isNew={(route) => route.params.inventoryProduct === undefined}
      getDefaultValues={async (route) => {
        return route.params.inventoryProduct === undefined
          ? {
              id: '',
              productId: '',
              name: '',
              description: '',
              inventoryStock: {
                id: '',
                stock: 0,
                createdAt: '',
                inventory: {
                  id: '',
                  name: '',
                  location: '',
                },
              },
              costPrice: 0,
              salePrice: 0,
              isDiscontinued: false,
              codes: [],
              createdAt: '',
            }
          : route.params.inventoryProduct;
      }}
      handleNewEntity={async (values, route) => {
        try {
          await createInventoryProduct({
            inventoryId: values.inventoryStock.inventory.id,
            name: values.name,
            salePrice: values.salePrice,
            costPrice: values.costPrice,
            codes: values.codes,
            stock: values.inventoryStock.stock,
            isDiscontinued: values.isDiscontinued,
          });
        } catch (error) {
          console.log(error);
        }
      }}
      handleEntityUpdate={async (values, route) => {
        const alreadyInInventory = await isProductInInventory(values.productId);

        try {
          let inventoryStockId = values.id;

          if (!alreadyInInventory) {
            const inventoryStock = await addToInventory({
              productId: values.productId,
              inventoryId: values.inventoryStock.inventory.id,
              stock: values.inventoryStock.stock,
            });
            inventoryStockId = inventoryStock.id;
          }

          await updateInventoryProduct({
            id: inventoryStockId,
            changes: {
              inventoryId: values.inventoryStock.inventory.id,
              name: values.name,
              salePrice: values.salePrice,
              costPrice: values.costPrice,
              description: values.description,
              isDiscontinued: values.isDiscontinued,
              stock: values.inventoryStock.stock,
              codes: values.codes,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }}
      Fields={InventoryProductFormFields}
    />
  );
}
