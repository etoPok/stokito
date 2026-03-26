import { CreateEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/resolver';
import { v4 as uuidv4 } from 'uuid';
import {
  InventoryProductFormFields,
  InventoryProductFormFieldType,
} from '../components/inventoryProductFormFields';
import { DefaultValues } from 'react-hook-form';
import repository from '../services/repositories';
import { useProducts } from '../hooks/productContext';
import { inventoryProductResolver } from '../domain/inventoryProduct';
import { productCodeResolver } from '../domain/productCode';

export function InventoryProductScreen() {
  const { pullProducts } = useProducts();

  return (
    <CreateEntityScreen<InventoryProductFormFieldType, 'InventoryProductScreen'>
      titleNew="Nuevo producto"
      titleView="Producto"
      resolver={createResolver([inventoryProductResolver, productCodeResolver])}
      isNew={(route) => route.params.inventoryProduct === undefined}
      getDefaultValues={async (route) => {
        if (route.params.inventoryProduct) {
          const codes = await repository.fetchProductCodes(
            route.params.inventoryProduct.id!
          );
          return {
            inventoryProduct: route.params.inventoryProduct,
            productCode: codes,
          } satisfies DefaultValues<InventoryProductFormFieldType>;
        }
        return {
          inventoryProduct: {
            id: uuidv4(),
            name: undefined,
            description: undefined,
            stok: undefined,
            costPrice: undefined,
            salePrice: undefined,
            inventory: undefined,
            isDiscontinued: false,
            createdAt: undefined,
          },
          productCode: [],
        } satisfies DefaultValues<InventoryProductFormFieldType>;
      }}
      save={async (values, route) => {
        if (route.params.inventoryProduct === undefined) {
          try {
            await repository.addProductToInventory(
              values.inventoryProduct.id!,
              values.inventoryProduct.name!,
              values.inventoryProduct.salePrice!,
              values.inventoryProduct.costPrice!,
              values.inventoryProduct.description,
              values.inventoryProduct.isDiscontinued!,
              values.inventoryProduct.stok!,
              values.inventoryProduct.inventory?.id!,
              values.productCode
            );
            await pullProducts();
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('UPDATE');
        }
      }}
      Fields={InventoryProductFormFields}
    />
  );
}
