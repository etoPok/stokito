import { InventoryProduct } from '../domain/inventoryProduct';
import * as InventoryProductRepo from '../services/repoInventoryProduct';
import { createPaginatedHooks } from './createPaginatedHooks';
import { QueryKeys } from './queryKeys';

const productRepo = {
  getPage: InventoryProductRepo.getInventoryProductPage,
  create: InventoryProductRepo.createInventoryProduct,
  remove: InventoryProductRepo.deleteInventoryProduct,
  update: InventoryProductRepo.updateInventoryProduct,
};

export const {
  useItems: useInventoryProducts,
  useCreate: useCreateInventoryProduct,
  useRemove: useDeleteInventoryProduct,
  useUpdate: useUpdateInventoryProduct,
} = createPaginatedHooks<
  InventoryProduct,
  InventoryProductRepo.CreateInventoryProductInput
>(productRepo, QueryKeys.inventoryProducts);
