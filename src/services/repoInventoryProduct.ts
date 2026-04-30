import { InventoryProduct } from '../domain/inventoryProduct';
import { Inventory } from '../domain/inventory';
import { ProductCode } from '../domain/productCode';
import { stokitoDB } from './apiStokitoDatabase';

export async function createInventory(
  id: string,
  name: string,
  location: string
): Promise<Inventory> {
  const date = new Date().toISOString();
  await stokitoDB.createInventory(id, name, location, date);
  const inventory: Inventory = { id, name, location, createdAt: date };
  return inventory;
}

export async function getAllInventories(): Promise<Inventory[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllInventories();
  const inventories: Inventory[] = [];
  rows.forEach((r) => {
    const inventory: Inventory = {
      id: r.id,
      name: r.name,
      location: r.location,
      createdAt: r.created_at,
    };
    inventories.push(inventory);
  });
  return inventories;
}

export async function getInventory(id: string): Promise<Inventory> {
  const row = await stokitoDB.getInventory(id);
  const inventory: Inventory = {
    id: row.id,
    name: row.name,
    location: row.location,
    createdAt: row.created_at,
  };
  return inventory;
}

export async function deleteInventory(id: string): Promise<boolean> {
  const changes = await stokitoDB.deleteInventory(id);
  return changes === 1;
}

export async function createInventoryStock(
  id: string,
  productId: string,
  name: string,
  salePrice: number,
  costPrice: number,
  description: string | undefined,
  isDiscontinued: boolean,
  stock: number,
  inventoryId: string,
  productCodes: ProductCode[]
): Promise<string> {
  const date = new Date().toISOString();
  await stokitoDB.createProduct(
    productId,
    name,
    salePrice,
    costPrice,
    description,
    isDiscontinued,
    date
  );
  try {
    for (const pc of productCodes) {
      await stokitoDB.createProductCode(
        pc.id,
        id,
        pc.code,
        pc.codeType,
        pc.isPrimary
      );
    }
  } catch (error) {
    await stokitoDB.deleteProduct(id);
    console.log(error);
  }
  await stokitoDB.createInventoryStock(id, productId, inventoryId, stock, date);
  return id;
}

export async function addProductToInventory(
  id: string,
  productId: string,
  inventoryId: string,
  stock: number
): Promise<string> {
  await stokitoDB.createInventoryStock(
    id,
    productId,
    inventoryId,
    stock,
    new Date().toISOString()
  );
  return id;
}

export async function updateInventoryStock(
  id: string,
  productId: string,
  name?: string,
  description?: string,
  salePrice?: number,
  costPrice?: number,
  inventoryId?: string,
  stock?: number,
  productCodes?: ProductCode[],
  isDiscontinued?: boolean
): Promise<void> {
  try {
    if (productCodes) {
      const pcs = await stokitoDB.getAllCodesByProduct(productId);
      for (const pc of productCodes) {
        const existingProductCode = pcs.find((value) => value.id === pc.id);
        if (existingProductCode) {
          await stokitoDB.updateProductCode(
            pc.id,
            pc.code,
            pc.codeType,
            pc.isPrimary
          );
        } else {
          await stokitoDB.createProductCode(
            pc.id,
            productId,
            pc.code,
            pc.codeType,
            pc.isPrimary
          );
        }
      }
    }
    await stokitoDB.updateProduct(
      productId,
      name,
      description,
      isDiscontinued,
      salePrice,
      costPrice
    );
    await stokitoDB.updateInventoryStock(id, inventoryId, stock);
  } catch (error) {
    console.log(error);
  }
}

export async function getInventoryProducts(
  inventoryId: string
): Promise<InventoryProduct[]> {
  const row = await stokitoDB.getInventory(inventoryId);
  const inventory: Inventory = {
    id: row.id,
    name: row.name,
    location: row.location,
    createdAt: row.created_at,
  };

  const rows: any[] =
    await stokitoDB.getAllInventoryStocksByInventory(inventoryId);
  const inventoryProducts: InventoryProduct[] = [];
  rows.forEach((r) => {
    inventoryProducts.push({
      id: r.id,
      productId: r.product_id,
      name: r.name,
      salePrice: r.sale_price,
      costPrice: r.cost_price,
      description: r.description,
      isDiscontinued: r.is_discontinued,
      createdAt: r.created_at,
      stock: r.stock,
      inventory: inventory,
    });
  });
  return inventoryProducts;
}
