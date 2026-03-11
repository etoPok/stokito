import { stokitoDB } from './apiStokitoDatabase';
import { Inventory } from '../domain/inventory';
import { Product } from '../domain/product';
import { Sale } from '../domain/sale';
import { SaleDatail, SaleDetailsByProduct } from '../domain/saleDetails';
import { InventoryProduct } from '../domain/inventoryProduct';

class Repository {
  // PRODUCT
  async setProduct(
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

  async getAllProducts(): Promise<Product[]> {
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

  async findProduct(id: string): Promise<Product> {
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

  async removeProduct(id: string): Promise<boolean> {
    const changes = await stokitoDB.removeProduct(id);
    return changes === 1;
  }

  // INVENTORY
  async setInventory(
    id: string,
    name: string,
    location: string
  ): Promise<Inventory> {
    const date = new Date().toISOString();
    await stokitoDB.addInventory(id, name, location, date);
    const inventory: Inventory = { id, name, location, createdAt: date };
    return inventory;
  }
  async getAllInventories(): Promise<Inventory[]> {
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

  async findInventory(id: string): Promise<Inventory> {
    const row = await stokitoDB.findInventory(id);
    const inventory: Inventory = {
      id: row.id,
      name: row.name,
      location: row.location,
      createdAt: row.created_at,
    };
    return inventory;
  }
  async removeInventory(id: string): Promise<boolean> {
    const changes = await stokitoDB.removeInventory(id);
    return changes === 1;
  }

  // INVENTORY ITEM

  private async setInventoryItem(
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

  async addProductToInventory(
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
    const product = await this.setProduct(
      id,
      name,
      salePrice,
      costPrice,
      description,
      isDiscontinued,
      sku
    );
    await this.setInventoryItem(inventoryId, product.id, stock);
    return product;
  }

  async getInventoryProducts(inventoryId: string): Promise<InventoryProduct[]> {
    const row = await stokitoDB.findInventory(inventoryId);
    const inventory: Inventory = {
      id: row.id,
      name: row.name,
      location: row.location,
      createdAt: row.created_at,
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

  async addSale(id: string, date: string, total: number): Promise<Sale> {
    const resultId = await stokitoDB.addSale(id, date, total);
    return { id: resultId, date: date, total: total };
  }

  async getAllSales(): Promise<Sale[]> {
    // type-unsafe
    const rows = await stokitoDB.getAllSales();
    const sales: Sale[] = [];
    rows.forEach((r) => {
      sales.push({ id: r.id, date: r.date, total: r.total });
    });
    return sales;
  }

  // SALE DETAIL

  async addSaleDetail(
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
      quantity,
      false
    );
    return {
      id: id,
      saleId: saleId,
      productName: productName,
      salePrice: price,
      subtotal: subtotal,
      quantity: quantity,
      isVoided: false,
    };
  }

  async fetchAllSaleDetails(): Promise<SaleDatail[]> {
    const rows = await stokitoDB.fetchAllSaleDetails();
    const saleDetails: SaleDatail[] = [];
    rows.forEach((r) => {
      saleDetails.push({
        id: r.id,
        saleId: r.sale_id,
        productName: r.product_name,
        salePrice: r.sale_price,
        subtotal: r.subtotal,
        quantity: r.quantity,
        isVoided: r.is_voided,
      });
    });
    return saleDetails;
  }

  async postSaleDetails(
    saleDetails: SaleDetailsByProduct,
    saleId: string
  ): Promise<void> {
    const saleDetailsKeys = Object.keys(saleDetails);
    for (const key of saleDetailsKeys) {
      const sd = saleDetails[key];
      if (sd.saleId === saleId) {
        await this.addSaleDetail(
          sd.id,
          saleId,
          sd.productName,
          sd.salePrice,
          sd.quantity,
          sd.subtotal
        );
      }
    }
  }
}

const repository = new Repository();
export default repository;
