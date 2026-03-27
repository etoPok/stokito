import DB from '../services/dataBase';

interface StokitoDatabase {
  addProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string | undefined,
    isDiscontinued: boolean,
    createdAt: string
  ): Promise<string>;
  removeProduct(id: string): Promise<number>;
  findProduct(id: string): Promise<any>;
  getAllProducts(): Promise<any[]>;

  addInventory(
    id: string,
    name: string,
    location: string,
    createdAt: string
  ): Promise<string>;
  removeInventory(id: string): Promise<number>;
  findInventory(id: string): Promise<any>;
  getAllInventories(): Promise<any[]>;

  addProductToInventory(
    productId: string,
    inventoryId: string,
    stock: number,
    created_at: string
  ): Promise<number>;
  getInventoryProducts(inventoryId: string): Promise<any[]>;

  addSale(id: string, date: string, total: number): Promise<string>;
  getAllSales(): Promise<any[]>;
  addSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number,
    isVoided: boolean
  ): Promise<string>;
  fetchAllSaleDetails(): Promise<any[]>;

  createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean
  ): Promise<string>;
  fetchProductByCode(code: string): Promise<any>;
  fetchProductCodes(productId: string): Promise<any[]>;
}

class ApiStokitoDatabase implements StokitoDatabase {
  async addProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string | undefined,
    isDiscontinued: boolean,
    createdAt: string
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    // Using throw makes the async function return a rejected promise which is then handled by a try-catch.
    // result -> resusable SQL statment
    const result = await db.runAsync(
      `
        INSERT INTO product_definition (id, name, sale_price, cost_price, description, is_discontinued, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        id,
        name,
        salePrice,
        costPrice,
        description === undefined ? null : description,
        Number(isDiscontinued),
        createdAt,
      ]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async removeProduct(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
        DELETE FROM product_definition WHERE id = ?;
      `,
      [id]
    );
    if (result.changes === 0) {
      throw new Error('Product ${id} does not exist or was already removed');
    }
    if (result.changes > 1) {
      throw new Error('Multiple products deleted for id ${id}');
    }
    return result.changes;
  }

  async findProduct(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const row = await db.getFirstAsync(
      `
      SELECT * FROM product_definition WHERE id = ?;
    `,
      [id]
    );
    if (!row) {
      throw new Error(`Row not found for id ${id}`);
    }
    return row;
  }

  async getAllProducts(): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT * FROM product_definition;
      `,
      []
    );
    return rows;
  }

  async addInventory(
    id: string,
    name: string,
    location: string,
    createdAt: string
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory (id, name, location, created_at)
      VALUES (?, ?, ?, ?);
    `,
      [id, name, location, createdAt]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async removeInventory(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      DELETE FROM inventory WHERE id = ?;
    `,
      [id]
    );
    if (result.changes === 0) {
      throw new Error('Inventory ${id} does not exist or was already removed');
    }
    if (result.changes > 1) {
      throw new Error('Multiple inventories deleted for id ${id}');
    }
    return result.changes;
  }

  async findInventory(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const row = await db.getFirstAsync(
      `
      SELECT id, name, location, created_at FROM inventory WHERE id = ?;
    `,
      [id]
    );
    if (!row) {
      throw new Error('Row not found for id ${id}');
    }
    return row;
  }

  async getAllInventories(): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT * FROM inventory;
      `,
      []
    );
    return rows;
  }

  async addProductToInventory(
    productId: string,
    inventoryId: string,
    stock: number,
    created_at: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory_product (inventory_id, product_definition_id, stock, created_at)
      VALUES (?, ?, ?, ?);
    `,
      [inventoryId, productId, stock, created_at]
    );
    return result.lastInsertRowId;
  }

  async getInventoryProducts(inventoryId: string): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT
        pd.id,
        pd.name,
        pd.sale_price,
        pd.cost_price,
        pd.is_discontinued,
        pd.description,
        ii.created_at,
        ii.stock
      FROM inventory_product ii
      JOIN product_definition pd ON pd.id = ii.product_definition_id
      WHERE ii.inventory_id = ?;
    `,
      [inventoryId]
    );
    return rows;
  }

  async addSale(id: string, date: string, total: number): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO sale (id, date, total)
      VALUES (?, ?, ?);
    `,
      [id, date, total]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async getAllSales(): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const results = await db.getAllAsync(
      `
      SELECT id, date, total FROM sale;
    `,
      []
    );
    return results;
  }

  async addSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number,
    isVoided: boolean
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO sale_detail (id, sale_id, product_name, sale_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
      [id, saleId, productName, price, quantity, subtotal, Number(isVoided)]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async fetchAllSaleDetails(): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const results = await db.getAllAsync(
      `
      SELECT
        id,
        sale_id,
        product_name,
        sale_price,
        quantity,
        subtotal,
        is_voided
      FROM sale_detail;
    `,
      []
    );
    return results;
  }

  async createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean
  ): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO product_code (id, product_id, code, code_type, is_primary)
      VALUES (?, ?, ?, ?, ?);
    `,
      [id, productId, code, codeType, Number(isPrimary)]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async fetchProductByCode(code: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.getFirstAsync(
      `
      SELECT pd.*
      FROM product_definition pd
      JOIN product_code pc
        ON pd.id = pc.product_id
      WHERE pc.code = ?;
    `,
      [code]
    );
    return result;
  }

  async fetchProductCodes(productId: string): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT id, code, code_type, is_primary
      FROM product_code
      WHERE product_id = ?
      ORDER BY is_primary DESC;
    `,
      [productId]
    );
    return rows;
  }
}

export const stokitoDB: StokitoDatabase = new ApiStokitoDatabase();
