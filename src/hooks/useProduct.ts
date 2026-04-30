import { Product } from '../domain/product';
import * as ProductRepo from '../services/repoProduct';
import { createPaginatedHooks } from './createPaginatedHooks';
import { QueryKeys } from './queryKeys';

const productRepo = {
  getPage: ProductRepo.getProductPage,
  create: ProductRepo.createProduct,
  remove: ProductRepo.deleteProduct,
  update: ProductRepo.updateProduct,
};

export const {
  useItems: useProducts,
  useCreate: useCreateProduct,
  useRemove: useDeleteProduct,
  useUpdate: useUpdateProduct,
} = createPaginatedHooks<Product, ProductRepo.CreateProductInput>(
  productRepo,
  QueryKeys.products
);
