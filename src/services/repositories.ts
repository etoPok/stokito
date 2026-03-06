import { stokitoDB } from './apiStokitoDatabase';
import { Inventory } from '../domain/inventory';
import { Product } from '../domain/product';
import { Sale } from '../domain/sale';
import { SaleDatail } from '../domain/saleDetails';
import { InventoryProduct } from '../domain/inventoryProduct';

// PRODUCT

export async function setProduct(
  id: string,
  name: string,
  salePrice: number,
  costPrice: number,
  description: string | undefined,
  isDiscontinued: boolean,
  sku: string | undefined
): Promise<Product> {
  const createdAt = new Date().toISOString();
  await stokitoDB.addProduct(
    id,
    name,
    salePrice,
    costPrice,
    description,
    isDiscontinued,
    createdAt,
    sku
  );
  const product: Product = {
    id: id,
    name: name,
    salePrice: salePrice,
    costPrice: costPrice,
    description: description,
    isDiscontinued: isDiscontinued,
    sku: sku,
    createdAt: createdAt,
  };
  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllProducts();
  const products: Product[] = [];
  rows.forEach((r) => {
    const product: Product = {
      id: r.id,
      name: r.name,
      salePrice: r.sale_price,
      costPrice: r.cost_price,
      description: r.description,
      isDiscontinued: r.is_discontinued,
      sku: r.sku,
      createdAt: r.created_at,
    };
    products.push(product);
  });
  return products;
}

export async function findProduct(id: string): Promise<Product> {
  const row = await stokitoDB.findProduct(id);
  const product: Product = {
    id: row.id,
    name: row.name,
    salePrice: row.sale_price,
    costPrice: row.cost_price,
    description: row.description,
    isDiscontinued: row.is_discontinued,
    sku: row.sku,
    createdAt: row.created_at,
  };
  return product;
}

export async function removeProduct(id: string): Promise<boolean> {
  const changes = await stokitoDB.removeProduct(id);
  return changes === 1;
}

// INVENTORY

export async function setInventory(
  id: string,
  name: string,
  location: string
): Promise<Inventory> {
  const date = new Date().toISOString();
  await stokitoDB.addInventory(id, name, location, date);
  const inventory: Inventory = { id, name, location, date };
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
      date: r.created_at,
    };
    inventories.push(inventory);
  });
  return inventories;
}

export async function findInventory(id: string): Promise<Inventory> {
  const row = await stokitoDB.findInventory(id);
  const inventory: Inventory = {
    id: row.id,
    name: row.name,
    location: row.location,
    date: row.created_at,
  };
  return inventory;
}

export async function removeInventory(id: string): Promise<boolean> {
  const changes = await stokitoDB.removeInventory(id);
  return changes === 1;
}

// INVENTORY ITEM

async function setInventoryItem(
  inventoryId: string,
  productId: string,
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
  id: string,
  name: string,
  salePrice: number,
  costPrice: number,
  description: string | undefined,
  isDiscontinued: boolean,
  sku: string | undefined,
  stock: number,
  inventoryId: string
): Promise<Product> {
  const product = await setProduct(
    id,
    name,
    salePrice,
    costPrice,
    description,
    isDiscontinued,
    sku
  );
  await setInventoryItem(inventoryId, product.id, stock);
  return product;
}

export async function getInventoryProducts(
  inventoryId: string
): Promise<InventoryProduct[]> {
  const row = await stokitoDB.findInventory(inventoryId);
  const inventory: Inventory = {
    id: row.id,
    name: row.name,
    location: row.location,
    date: row.created_at,
  };

  const rows: any[] = await stokitoDB.getInventoryProducts(inventoryId);
  const inventoryProducts: InventoryProduct[] = [];
  rows.forEach((r) => {
    inventoryProducts.push({
      id: r.id,
      name: r.name,
      salePrice: r.sale_price,
      costPrice: r.cost_price,
      description: r.description,
      isDiscontinued: r.is_discontinued,
      sku: r.sku,
      createdAt: r.created_at,
      stok: r.stock,
      inventory: inventory,
    });
  });
  return inventoryProducts;
}

// SALE

export async function addSale(
  id: string,
  date: string,
  total: number
): Promise<Sale> {
  const resultId = await stokitoDB.addSale(id, date, total);
  const sale = new Sale(resultId, date, total);
  return sale;
}

export async function getAllSales(): Promise<Sale[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllSales();
  const sales: Sale[] = [];
  rows.forEach((r) => {
    const sale = new Sale(r.id, r.date, r.total);
    sale.setId(r.id!);
    sales.push(sale);
  });
  return sales;
}

// SALE PRODUCT

export async function addSaleDetail(
  id: string,
  saleId: string,
  productName: string,
  price: number,
  quantity: number,
  subtotal: number
): Promise<SaleDatail> {
  await stokitoDB.addSaleDetail(
    id,
    saleId,
    productName,
    price,
    subtotal,
    quantity
  );
  return new SaleDatail(id, saleId, productName, price, subtotal, quantity);
}
