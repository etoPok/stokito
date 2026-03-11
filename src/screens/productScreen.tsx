import { Product, productRequiredFieldMessages } from '../domain/product';
import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/requiredFieldsValidator';
import { v4 as uuidv4 } from 'uuid';
import { ProductFormFields } from '../components/productFormFields';
import { DefaultValues } from 'react-hook-form';
import { useProducts } from '../hooks/productContext';

export function ProductScreen() {
  const { addProduct } = useProducts();

  return createEntityScreen<Product, 'ProductScreen'>({
    titleNew: 'Nuevo producto',
    titleView: 'Producto',

    resolver: createResolver(productRequiredFieldMessages),

    isNew: (route) => route.params.product === undefined,

    getDefaultValues: (route) =>
      route.params.product ??
      ({
        id: uuidv4(),
        name: undefined,
        description: undefined,
        sku: undefined,
        costPrice: undefined,
        salePrice: undefined,
        isDiscontinued: false,
        createdAt: undefined,
      } satisfies DefaultValues<Product>),

    save: async (values, route) => {
      if (route.params.product === undefined) {
        addProduct({
          id: values.id!,
          name: values.name!,
          salePrice: values.salePrice!,
          costPrice: values.costPrice!,
          description: values.description,
          isDiscontinued: values.isDiscontinued!,
          sku: values.sku,
          createdAt: '',
        });
      } else {
        console.log('UPDATE');
      }
    },

    Fields: ProductFormFields,
  })();
}
