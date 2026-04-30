import { CreateEntityScreen } from '../components/createEntityScreen';
import { DefaultValues } from 'react-hook-form';
import { Product, SchemaProduct } from '../domain/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormFields } from '../components/productFormFields';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProduct';

export function ProductScreen() {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();

  return (
    <CreateEntityScreen<Product, 'ProductScreen'>
      titleNew="Nuevo Producto"
      titleView="Producto"
      resolver={zodResolver(SchemaProduct)}
      isNew={(route) => route.params.product === undefined}
      getDefaultValues={async (route) => {
        return route.params.product === undefined
          ? ({
              id: '',
              name: '',
              description: '',
              isDiscontinued: false,
              createdAt: '',
              codes: [],
            } satisfies DefaultValues<Product>)
          : route.params.product;
      }}
      handleNewEntity={async (values, route) => {
        try {
          await createProduct({
            name: values.name!,
            salePrice: values.salePrice,
            costPrice: values.costPrice,
            description: values.description,
            isDiscontinued: values.isDiscontinued,
            productCodes: values.codes,
          });
        } catch (error) {
          console.log(error);
        }
      }}
      handleEntityUpdate={async (values, route) => {
        try {
          await updateProduct({
            id: values.id,
            changes: {
              name: values.name,
              salePrice: values.salePrice,
              costPrice: values.costPrice,
              isDiscontinued: values.isDiscontinued,
              productCodes: values.codes,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }}
      Fields={ProductFormFields}
    />
  );
}
