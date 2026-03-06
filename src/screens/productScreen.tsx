import { Product, productRequiredFieldMessages } from '../domain/product';
import { createEntityScreen } from '../components/createEntityScreen';
import { createResolver } from '../domain/requiredFieldsValidator';
import { v4 as uuidv4 } from 'uuid';
import { setProduct } from '../services/repositories';
import { ProductFormFields } from '../components/productFormFields';

export const ProductScreen = createEntityScreen<Product, 'ProductScreen'>({
  titleNew: 'Nuevo producto',
  titleView: 'Producto',

  resolver: createResolver(productRequiredFieldMessages),

  isNew: (route) => route.params.product === undefined,

  getDefaultValues: (route) =>
    route.params.product ?? {
      id: uuidv4(),
      name: undefined,
      description: undefined,
      sku: undefined,
      costPrice: undefined,
      salePrice: undefined,
      isDiscontinued: false,
      createdAt: undefined,
    },

  save: async (values, route) => {
    if (route.params.product === undefined) {
      await setProduct(
        values.id!,
        values.name!,
        values.salePrice!,
        values.costPrice!,
        values.description,
        values.isDiscontinued!,
        values.sku
      );
    } else {
      console.log('UPDATE');
    }
  },

  Fields: ProductFormFields,
});
