import { stokitoDB } from './apiStokitoDatabase';
import { Inventory } from '../domain/inventory';
import { Product } from '../domain/product';
import { Sale } from '../domain/sale';
import { SaleDetail, SaleDetailsByProduct } from '../domain/saleDetails';
import { InventoryProduct } from '../domain/inventoryProduct';
import { ProductCode } from '../domain/productCode';

class Repository {
  // PRODUCT
  async setProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string | undefined,
    isDiscontinued: boolean,
    productCodes: ProductCode[]
  ): Promise<Product> {
    const createdAt = new Date().toISOString();
    await stokitoDB.createProduct(
      id,
      name,
      salePrice,
      costPrice,
      description,
      isDiscontinued,
      createdAt
    );
    try {
      for (const pc of productCodes) {
        await this.createProductCode(
          pc.id,
          id,
          pc.code,
          pc.codeType,
          pc.isPrimary
        );
      }
    } catch (error) {
      await stokitoDB.deleteProduct(id);
      throw error;
    }
    return {
      id: id,
      name: name,
      salePrice: salePrice,
      costPrice: costPrice,
      description: description,
      isDiscontinued: isDiscontinued,
      createdAt: createdAt,
    } satisfies Product;
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
        createdAt: r.created_at,
      };
      products.push(product);
    });
    return products;
  }

  async findProduct(id: string): Promise<Product> {
    const row = await stokitoDB.getProduct(id);
    const product: Product = {
      id: row.id,
      name: row.name,
      salePrice: row.sale_price,
      costPrice: row.cost_price,
      description: row.description,
      isDiscontinued: row.is_discontinued,
      createdAt: row.created_at,
    };
    return product;
  }

  async removeProduct(id: string): Promise<boolean> {
    const changes = await stokitoDB.deleteProduct(id);
    return changes === 1;
  }

  // INVENTORY
  async setInventory(
    id: string,
    name: string,
    location: string
  ): Promise<Inventory> {
    const date = new Date().toISOString();
    await stokitoDB.createInventory(id, name, location, date);
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
    const row = await stokitoDB.getInventory(id);
    const inventory: Inventory = {
      id: row.id,
      name: row.name,
      location: row.location,
      createdAt: row.created_at,
    };
    return inventory;
  }
  async removeInventory(id: string): Promise<boolean> {
    const changes = await stokitoDB.deleteInventory(id);
    return changes === 1;
  }

  // INVENTORY ITEM

  private async setInventoryItem(
    inventoryId: string,
    productId: string,
    stock: number
  ): Promise<number | null> {
    const created_at = new Date().toISOString();
    const result = await stokitoDB.createInventoryProduct(
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
    stock: number,
    inventoryId: string,
    productCodes: ProductCode[]
  ): Promise<Product> {
    const product = await this.setProduct(
      id,
      name,
      salePrice,
      costPrice,
      description,
      isDiscontinued,
      productCodes
    );
    await this.setInventoryItem(inventoryId, id, stock);
    return product;
  }

  async getInventoryProducts(inventoryId: string): Promise<InventoryProduct[]> {
    const row = await stokitoDB.getInventory(inventoryId);
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
        createdAt: r.created_at,
        stok: r.stock,
        inventory: inventory,
      });
    });
    return inventoryProducts;
  }

  // SALE

  async addSale(id: string, date: string, total: number): Promise<Sale> {
    const resultId = await stokitoDB.createSale(id, date, total);
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
  ): Promise<SaleDetail> {
    await stokitoDB.createSaleDetail(
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

  async fetchAllSaleDetails(): Promise<SaleDetail[]> {
    const rows = await stokitoDB.getAllSaleDetails();
    const saleDetails: SaleDetail[] = [];
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

  // PRODUCT CODE

  async createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean
  ): Promise<ProductCode> {
    await stokitoDB.createProductCode(id, productId, code, codeType, isPrimary);
    return {
      id: id,
      code: code,
      codeType: codeType,
      isPrimary: isPrimary,
    } satisfies ProductCode;
  }

  async fetchProductByCode(code: string): Promise<Product> {
    const row = await stokitoDB.getProductByCode(code);
    return {
      id: row.id,
      name: row.name,
      costPrice: row.cost_price,
      salePrice: row.sale_price,
      isDiscontinued: row.is_discontinued,
      description: row.description,
      createdAt: row.created_at,
    } satisfies Product;
  }

  async fetchProductCodes(productId: string): Promise<ProductCode[]> {
    const rows = await stokitoDB.getProductCodes(productId);
    return rows.map<ProductCode>((r) => {
      return {
        id: r.id,
        code: r.code,
        codeType: r.code_type,
        isPrimary: r.is_prumary,
      } satisfies ProductCode;
    });
  }
}

const repository = new Repository();
export default repository;
