import { CreateEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/resolver';
import { v4 as uuidv4 } from 'uuid';
import {
  ProductFormFields,
  ProductFormFieldsType,
} from '../components/productFormFields';
import { DefaultValues } from 'react-hook-form';
import { useProducts } from '../hooks/productContext';
import { productCodeResolver } from '../domain/productCode';
import { productResolver } from '../domain/product';
import { getProductCodes } from '../services/repoProductCode';
import { updateProduct } from '../services/repoProduct';

export function ProductScreen() {
  const { addProduct } = useProducts();

  return (
    <CreateEntityScreen<ProductFormFieldsType, 'ProductScreen'>
      titleNew="Nuevo Producto"
      titleView="Producto"
      resolver={createResolver([productResolver, productCodeResolver])}
      isNew={(route) => route.params.product === undefined}
      getDefaultValues={async (route) => {
        if (route.params.product) {
          const codes = await getProductCodes(route.params.product.id!);
          return {
            product: route.params.product,
            productCode: codes,
          } satisfies DefaultValues<ProductFormFieldsType>;
        }

        return {
          product: {
            id: uuidv4(),
            name: undefined,
            description: undefined,
            costPrice: undefined,
            salePrice: undefined,
            isDiscontinued: false,
            createdAt: undefined,
          },
          productCode: [],
        } satisfies DefaultValues<ProductFormFieldsType>;
      }}
      handleNewEntity={async (values, route) => {
        addProduct(
          {
            id: values.product.id!,
            name: values.product.name!,
            salePrice: values.product.salePrice!,
            costPrice: values.product.costPrice!,
            description: values.product.description,
            isDiscontinued: values.product.isDiscontinued!,
            createdAt: values.product.createdAt,
          },
          values.productCode
        );
      }}
      handleEntityUpdate={async (values, route) => {
        await updateProduct(
          values.product.id!,
          values.product.name!,
          values.product.description!,
          values.product.salePrice!,
          values.product.costPrice!,
          values.product.isDiscontinued
        );
      }}
      Fields={ProductFormFields}
    />
  );
}
