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
          // The product definition ID is associated with the codes.
          // The inventory product is merely an extension.
          const codes = await repository.fetchProductCodes(
            route.params.inventoryProduct.productId!
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
            stock: undefined,
            costPrice: undefined,
            salePrice: undefined,
            inventory: undefined,
            isDiscontinued: false,
            createdAt: undefined,
          },
          productCode: [],
        } satisfies DefaultValues<InventoryProductFormFieldType>;
      }}
      handleNewEntity={async (values, route) => {
        try {
          await repository.createInventoryProduct(
            values.inventoryProduct.id!,
            values.inventoryProduct.productId!,
            values.inventoryProduct.name!,
            values.inventoryProduct.salePrice!,
            values.inventoryProduct.costPrice!,
            values.inventoryProduct.description,
            values.inventoryProduct.isDiscontinued!,
            values.inventoryProduct.stock!,
            values.inventoryProduct.inventory?.id!,
            values.productCode
          );
          await pullProducts();
        } catch (error) {
          console.log(error);
        }
      }}
      handleEntityUpdate={async (values, route) => {
        try {
          await repository.addProductToInventory(
            values.inventoryProduct.id!,
            values.inventoryProduct.productId!,
            values.inventoryProduct.inventory?.id!,
            values.inventoryProduct.stock!
          );
        } catch (error: unknown) {
          if (
            typeof error === 'object' &&
            error != null &&
            'message' in error &&
            'code' in error &&
            typeof (error as Record<string, unknown>).message === 'string'
          ) {
            // SQLite error code 1555 = PRIMARY KEY constraint, 2067 = UNIQUE constraint
            const isPrimaryKey =
              error.code === 1555 ||
              /UNIQUE constraint failed: inventory_product\.id/i.test(
                error.message as string
              );

            const isUniqueConstraint =
              error.code === 2067 ||
              /UNIQUE constraint failed: inventory_product\.(inventory_id|product_id)/i.test(
                error.message as string
              );

            if (!isPrimaryKey && !isUniqueConstraint) {
              console.log(error);
              return;
            }
          }
        }

        await repository.updateInventoryProduct(
          values.inventoryProduct.id!,
          values.inventoryProduct.productId!,
          values.inventoryProduct.name!,
          values.inventoryProduct.description,
          values.inventoryProduct.salePrice!,
          values.inventoryProduct.costPrice!,
          values.inventoryProduct.inventory?.id!,
          values.inventoryProduct.stock!,
          values.productCode,
          values.inventoryProduct.isDiscontinued
        );
      }}
      Fields={InventoryProductFormFields}
    />
  );
}
