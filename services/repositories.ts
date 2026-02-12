import { stokitoDB } from './apiStokitoDatabase';
import Inventory from '../domain/inventory';
import { Product } from '../domain/product';

// PRODUCT

export async function setProduct(
  name: string,
  description: string,
  isDiscontinued: boolean,
  sku: string | null
): Promise<Product> {
  const product = new Product(name, description, isDiscontinued, sku);
  const resultId = await stokitoDB.addProduct(
    product.name,
    product.description,
    product.isDiscontinued,
    product.createdAt,
    product.sku
  );
  product.setId(resultId);
  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  // type-unsafe
  const rows = (await stokitoDB.getAllProducts()) as Product[];
  const products: Product[] = [];
  rows.forEach((r) => {
    const inventory = new Product(
      r.name,
      r.description,
      r.isDiscontinued,
      r.sku
    );
    inventory.setId(r.id!);
    products.push(inventory);
  });
  return products;
}

export async function findProduct(id: number): Promise<Product> {
  const row = (await stokitoDB.findProduct(id)) as Product;
  const product = new Product(
    row.name,
    row.description,
    row.isDiscontinued,
    row.sku
  );
  return product;
}

export async function removeProduct(id: number): Promise<boolean> {
  const changes = await stokitoDB.removeProduct(id);
  return changes === 1;
}

// INVENTORY

export async function setInventory(
  name: string,
  location: string
): Promise<Inventory> {
  const inventory = new Inventory(name, location);
  const resultId = await stokitoDB.addInventory(
    inventory.name,
    inventory.location,
    inventory.createdAt
  );
  inventory.setId(resultId);
  return inventory;
}
export async function getAllInventories(): Promise<Inventory[]> {
  // type-unsafe
  const rows = (await stokitoDB.getAllInventories()) as Inventory[];
  const inventories: Inventory[] = [];
  rows.forEach((r) => {
    const inventory = new Inventory(r.name, r.location);
    inventory.setId(r.id!);
    inventories.push(inventory);
  });
  return inventories;
}

export async function findInventory(id: number): Promise<Inventory> {
  const row = (await stokitoDB.findProduct(id)) as Inventory;
  const inventory = new Inventory(row.name, row.location);
  return inventory;
}

export async function removeInventory(id: number): Promise<boolean> {
  const changes = await stokitoDB.removeInventory(id);
  return changes === 1;
}

// INVENTORY ITEM

async function setInventoryItem(
  inventoryId: number,
  productId: number,
  stock: number
): Promise<number | null> {
  const created_at = new Date().toISOString();
  const result = await stokitoDB.addProductToInventory(
    productId,
    inventoryId,
    stock,
    created_at
  );
  return result;
}

export async function addProductToInventory(
  name: string,
  description: string,
  isDiscontinued: boolean,
  sku: string | null,
  stock: number,
  inventoryId: number
): Promise<Product | null> {
  const product = await setProduct(name, description, isDiscontinued, sku);
  await setInventoryItem(inventoryId, product.id!, stock);
  return product;
}
