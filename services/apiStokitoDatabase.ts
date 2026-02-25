import DB from '../services/dataBase';

interface StokitoDatabase {
  addProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string,
    isDiscontinued: boolean,
    createdAt: string,
    sku: string | null
  ): Promise<string>;
  removeProduct(id: number): Promise<number>;
  findProduct(id: string): Promise<any>;
  getAllProducts(): Promise<any[]>;

  addInventory(
    name: string,
    location: string,
    createdAt: string
  ): Promise<number>;
  removeInventory(id: number): Promise<number>;
  findInventory(id: number): Promise<any>;
  getAllInventories(): Promise<any[]>;

  addProductToInventory(
    productId: string,
    inventoryId: number,
    stock: number,
    created_at: string
  ): Promise<number>;

  addSale(id: string, date: string, total: number): Promise<string>;
  getAllSales(): Promise<any[]>;
  addProductToSale(
    id: string,
    productId: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number
  ): Promise<string>;
}

class ApiStokitoDatabase implements StokitoDatabase {
  async addProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string,
    isDiscontinued: boolean,
    createdAt: string,
    sku: string | null
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    // Using throw makes the async function return a rejected promise which is then handled by a try-catch.
    // result -> resusable SQL statment
    const result = await db.runAsync(
      `
        INSERT INTO product_definition (id, name, sale_price, cost_price, sku, description, is_discontinued, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        id,
        name,
        salePrice,
        costPrice,
        sku,
        description,
        Number(isDiscontinued),
        createdAt,
      ]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }

  async removeProduct(id: number): Promise<number> {
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
    name: string,
    location: string,
    createdAt: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory (name, location, created_at)
      VALUES (?, ?, ?);
    `,
      [name, location, createdAt]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return result.lastInsertRowId;
  }

  async removeInventory(id: number): Promise<number> {
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

  async findInventory(id: number): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const row = await db.getFirstAsync(
      `
      SELECT * FROM inventory WHERE id = ?;
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
    inventoryId: number,
    stock: number,
    created_at: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory_item (inventory_id, product_definition_id, stock, created_at)
      VALUES (?, ?, ?, ?);
    `,
      [inventoryId, productId, stock, created_at]
    );
    return result.lastInsertRowId;
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

  async addProductToSale(
    id: string,
    productId: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO sale_product (id, product_definition_id, sale_id, product_name, price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
      [id, productId, saleId, productName, price, quantity, subtotal]
    );
    if (result.changes !== 1) {
      throw new Error('Unexpected number of affected rows during insertion');
    }
    return id;
  }
}

export const stokitoDB: StokitoDatabase = new ApiStokitoDatabase();
