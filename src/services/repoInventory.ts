import { Inventory } from '../domain/inventory';
import { stokitoDB } from './apiStokitoDatabase';
import { v4 as uuid } from 'uuid';

export type CreateInventoryInput = {
  name: string;
  location: string;
};

function assembleInventory(inventory: any): Inventory {
  return {
    id: inventory.id,
    name: inventory.name,
    location: inventory.location,
    createdAt: inventory.created_at,
  };
}

export async function createInventory({
  name,
  location,
}: CreateInventoryInput): Promise<Inventory> {
  const inventoryId = uuid();
  const date = new Date().toISOString();

  await stokitoDB.createInventory(inventoryId, name, location, date);

  return {
    id: inventoryId,
    name: name,
    location: location,
    createdAt: date,
  };
}

export async function getInventoryPage(
  cursor: number,
  limit: number
): Promise<{ items: Inventory[]; nextCursor: number | null }> {
  const inventories = await stokitoDB.getInventoryPage(cursor, limit);
  if (inventories.length === 0) return { items: [], nextCursor: null };
  return {
    items: inventories.map((i) => assembleInventory(i)),
    nextCursor:
      inventories.length === limit ? (inventories.at(-1)?.rowid ?? null) : null,
  };
}

export async function deleteInventory(id: string): Promise<boolean> {
  const changes = await stokitoDB.deleteInventory(id);
  return changes === 1;
}

export async function updateInventory(
  id: string,
  changes: Partial<CreateInventoryInput>
): Promise<void> {
  const inventory = await stokitoDB.getInventory(id);
  if (inventory === null) throw new Error(`Inventory ${id} not found`);
  await stokitoDB.updateInventory(id, changes.name, changes.location);
}
