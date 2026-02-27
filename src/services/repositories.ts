import { stokitoDB } from './apiStokitoDatabase';
import Inventory from '../domain/inventory';
import { Product } from '../domain/product';
import { Sale } from '../domain/sale';
import { SaleDatail } from '../domain/saleDetails';

// PRODUCT

export async function setProduct(
  id: string,
  name: string,
  salePrice: number,
  costPrice: number,
  description: string,
  isDiscontinued: boolean,
  sku: string | null
): Promise<Product> {
  const product = new Product(
    id,
    name,
    salePrice,
    costPrice,
    description,
    isDiscontinued,
    sku
  );
  await stokitoDB.addProduct(
    product.id,
    product.name,
    product.salePrice,
    product.costPrice,
    product.description,
    product.isDiscontinued,
    product.createdAt,
    product.sku
  );
  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllProducts();
  const products: Product[] = [];
  rows.forEach((r) => {
    const product = new Product(
      r.id,
      r.name,
      r.sae_price,
      r.cost_price,
      r.description,
      r.is_discontinued,
      r.sku
    );
    product.setId(r.id!);
    products.push(product);
  });
  return products;
}

export async function findProduct(id: string): Promise<Product> {
  const row = await stokitoDB.findProduct(id);
  const product = new Product(
    row.id,
    row.name,
    row.sale_price,
    row.cost_price,
    row.description,
    row.is_discontinued,
    row.sku
  );
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
  const resultId = await stokitoDB.addInventory(id, name, location, date);
  const inventory = new Inventory(id, name, location, date);
  inventory.setId(resultId);
  return inventory;
}
export async function getAllInventories(): Promise<Inventory[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllInventories();
  const inventories: Inventory[] = [];
  rows.forEach((r) => {
    const inventory = new Inventory(r.id, r.name, r.location, r.created_at);
    inventories.push(inventory);
  });
  return inventories;
}

export async function findInventory(id: number): Promise<Inventory> {
  const row = await stokitoDB.findInventory(id);
  const inventory = new Inventory(
    row.id,
    row.name,
    row.location,
    row.created_at
  );
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
  description: string,
  isDiscontinued: boolean,
  sku: string | null,
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
): Promise<Product[]> {
  const rows: any[] = await stokitoDB.getInventoryProducts(inventoryId);
  const products: Product[] = [];
  rows.forEach((r) => {
    products.push(
      new Product(
        r.id,
        r.name,
        r.sale_price,
        r.cost_price,
        r.description,
        r.is_discontinued,
        r.sku
      )
    );
  });
  return products;
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
