import { Inventory } from '../domain/inventory';
import * as InventoryRepo from '../services/repoInventory';
import { createPaginatedHooks } from './createPaginatedHooks';
import { QueryKeys } from './queryKeys';

const inventoryRepo = {
  getPage: InventoryRepo.getInventoryPage,
  create: InventoryRepo.createInventory,
  remove: InventoryRepo.deleteInventory,
  update: InventoryRepo.updateInventory,
};

export const {
  useItems: useInventories,
  useCreate: useCreateInventory,
  useRemove: useDeleteInventory,
  useUpdate: useUpdateInventory,
} = createPaginatedHooks<Inventory, InventoryRepo.CreateInventoryInput>(
  inventoryRepo,
  QueryKeys.inventories
);
