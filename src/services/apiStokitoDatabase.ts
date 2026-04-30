import DB from '../services/dataBase';

interface StokitoDatabase {
  createProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    isDiscontinued: boolean,
    createdAt: string,
    description?: string
  ): Promise<string>;
  deleteProduct(id: string): Promise<number>;
  getProduct(id: string): Promise<any>;
  getProductPage(cursor: number | null, limit: number): Promise<any[]>;
  updateProduct(
    id: string,
    name?: string,
    salePrice?: number,
    costPrice?: number,
    description?: string,
    isDiscontinued?: boolean
  ): Promise<number>;

  createInventory(
    id: string,
    name: string,
    location: string,
    createdAt: string
  ): Promise<string>;
  deleteInventory(id: string): Promise<number>;
  getInventory(id: string): Promise<any>;
  getInventories(inventoryIds: string[]): Promise<any[]>;
  getInventoryPage(cursor: number | null, limit: number): Promise<any[]>;
  updateInventory(
    id: string,
    name?: string,
    location?: string
  ): Promise<number>;

  createInventoryStock(
    id: string,
    productId: string,
    inventoryId: string,
    stock: number,
    createdAt: string
  ): Promise<number>;
  deleteInventoryStock(id: string): Promise<number>;
  getInventoryStock(id: string): Promise<any>;
  getInventoryStockPageByInventory(
    inventoryId: string,
    cursor: number | null,
    limit: number
  ): Promise<any[]>;
  getInventoryStockByProduct(productId: string): Promise<any>;
  getInventoryStocksByProducts(productIds: string[]): Promise<any[]>;
  getInventoryStockPage(cursor: number | null, limit: number): Promise<any[]>;
  updateInventoryStock(
    id: string,
    inventoryId?: string,
    stock?: number
  ): Promise<number>;

  createSale(id: string, total: number, createdAt: string): Promise<string>;
  getSale(id: string): Promise<any>;
  createSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number
  ): Promise<string>;
  getSaleDetailsBySale(saleId: string): Promise<any[]>;

  createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean,
    createdAt: string
  ): Promise<string>;
  deleteProductCode(id: string): Promise<number>;
  updateProductCode(
    id: string,
    code: string,
    codeType: string,
    isPrimary?: boolean
  ): Promise<number>;
  getProductByCode(code: string): Promise<any>;
  getCodesByProduct(productId: string): Promise<any[]>;
  getCodesByProducts(productIds: string[]): Promise<any[]>;
  getAllProductCodes(): Promise<any[]>;
}

function getPlaceholders(params: any[]) {
  return params.map(() => '?').join(',');
}

class ApiStokitoDatabase implements StokitoDatabase {
  async createProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    isDiscontinued: boolean,
    createdAt: string,
    description?: string
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    const params = [
      id,
      name,
      salePrice,
      costPrice,
      description ?? '',
      Number(isDiscontinued),
      createdAt,
    ];
    const placeholders = getPlaceholders(params);
    // Using throw makes the async function return a rejected promise which is then handled by a try-catch.
    // result -> resusable SQL statment
    await db.runAsync(
      `
        INSERT INTO product (id, name, sale_price, cost_price, description, is_discontinued, created_at)
        VALUES (${placeholders});
      `,
      params
    );
    return id;
  }

  async deleteProduct(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const result = await db.runAsync(`DELETE FROM product WHERE id = ?`, [id]);

    if (result.changes === 0) {
      throw new Error('DELETE_PRODUCT_NOT_FOUND');
    }

    if (result.changes > 1) {
      throw new Error('DELETE_PRODUCT_UNEXPECTED_MULTIPLE_CHANGES');
    }

    return result.changes;
  }

  async getProduct(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const row = await db.getFirstAsync(
      `
      SELECT * FROM product WHERE id = ?;
    `,
      [id]
    );
    if (!row) {
      throw new Error(`GET_PRODUCT_NOT_FOUND`);
    }
    return row;
  }

  async getProductPage(cursor: number, limit: number): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT *, rowid FROM product
      WHERE rowid > ?
      ORDER BY rowid
      LIMIT ?;
      `,
      [cursor, limit]
    );
    return rows ?? [];
  }

  async updateProduct(
    id: string,
    name?: string,
    salePrice?: number,
    costPrice?: number,
    description?: string,
    isDiscontinued?: boolean
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }

    if (salePrice !== undefined) {
      fields.push('sale_price = ?');
      values.push(salePrice);
    }

    if (costPrice !== undefined) {
      fields.push('cost_price = ?');
      values.push(costPrice);
    }

    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }

    if (isDiscontinued !== undefined) {
      fields.push('is_discontinued = ?');
      values.push(Number(isDiscontinued));
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
      UPDATE product
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.runAsync(query, values);

    if (result.changes === 0) {
      throw new Error('UPDATE_PRODUCT_NO_CHANGES');
    }

    return result.changes;
  }

  async createInventory(
    id: string,
    name: string,
    location: string,
    createdAt: string
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    await db.runAsync(
      `
      INSERT INTO inventory (id, name, location, created_at)
      VALUES (?, ?, ?, ?);
    `,
      [id, name, location, createdAt]
    );
    return id;
  }

  async deleteInventory(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const result = await db.runAsync(`DELETE FROM inventory WHERE id = ?`, [
      id,
    ]);

    if (result.changes === 0) {
      throw new Error('DELETE_INVENTORY_NOT_FOUND');
    }

    if (result.changes > 1) {
      throw new Error('DELETE_INVENTORY_UNEXPECTED_MULTIPLE_CHANGES');
    }

    return result.changes;
  }

  async getInventory(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const row = await db.getFirstAsync(
      `
      SELECT id, name, location, created_at FROM inventory WHERE id = ?;
    `,
      [id]
    );
    return row ?? null;
  }

  async getInventories(inventoryIds: string[]): Promise<any[]> {
    if (inventoryIds.length === 0) return [];

    const db = (await DB.getInstance('')).connection;
    const placeholders = getPlaceholders(inventoryIds);
    const rows = await db.getAllAsync(
      `
      SELECT * FROM inventory
      WHERE id IN (${placeholders})
    `,
      inventoryIds
    );
    return rows ?? [];
  }

  async getInventoryPage(cursor: number | null, limit: number): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const results = await db.getAllAsync(
      `
      SELECT *, rowid FROM inventory
      WHERE rowid > ?
      ORDER BY rowid
      LIMIT ?;
    `,
      [cursor, limit]
    );
    return results ?? [];
  }

  async updateInventory(
    id: string,
    name?: string,
    location?: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }

    if (location !== undefined) {
      fields.push('location = ?');
      values.push(location);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
      UPDATE inventory
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.runAsync(query, values);

    if (result.changes === 0) {
      throw new Error('UPDATE_INVENTORY_NO_CHANGES');
    }

    return result.changes;
  }

  async createInventoryStock(
    id: string,
    productId: string,
    inventoryId: string,
    stock: number,
    createdAt: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory_stock (id, product_id, inventory_id, stock, created_at)
      VALUES (?, ?, ?, ?, ?);
    `,
      [id, productId, inventoryId, stock, createdAt]
    );
    return result.lastInsertRowId;
  }

  async deleteInventoryStock(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const result = await db.runAsync(
      `DELETE FROM inventory_stock WHERE id = ?`,
      [id]
    );

    if (result.changes === 0) {
      throw new Error('DELETE_INVENTORY_STOCK_NOT_FOUND');
    }

    if (result.changes > 1) {
      throw new Error('DELETE_INVENTORY_STOCK_UNEXPECTED_MULTIPLE_CHANGES');
    }

    return result.changes;
  }

  async getInventoryStock(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.getFirstAsync(
      `
      SELECT * FROM inventory_stock
      WHERE id = ?;
    `,
      [id]
    );
    return result ?? null;
  }

  async getInventoryStockPageByInventory(
    inventoryId: string,
    cursor: number,
    limit: number
  ): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT *, rowid FROM inventory_stock
      WHERE inventory_id = ? AND rowid > ?
      ORDER BY rowid
      LIMIT ?;
    `,
      [inventoryId, cursor, limit]
    );
    return rows ?? [];
  }

  async getInventoryStockByProduct(productId: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.getFirstAsync(
      `
      SELECT * FROM inventory_stock
      WHERE product_id = ?;
    `,
      [productId]
    );
    return result ?? null;
  }

  async getInventoryStocksByProducts(productIds: string[]): Promise<any[]> {
    if (productIds.length === 0) return [];

    const db = (await DB.getInstance('')).connection;
    const placeholders = getPlaceholders(productIds);
    const rows = await db.getAllAsync(
      `
      SELECT * FROM inventory_stock
      WHERE product_id IN (${placeholders})
    `,
      productIds
    );
    return rows ?? [];
  }

  async getInventoryStockPage(cursor: number, limit: number): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const results = await db.getAllAsync(
      `
      SELECT *, rowid FROM inventory_stock
      WHERE rowid > ?
      ORDER BY rowid
      LIMIT ?;
    `,
      [cursor, limit]
    );
    return results ?? [];
  }

  async updateInventoryStock(
    id: string,
    inventoryId?: string,
    stock?: number
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const fields: string[] = [];
    const values: any[] = [];

    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }

    if (inventoryId !== undefined) {
      fields.push('inventory_id = ?');
      values.push(inventoryId);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
      UPDATE inventory_stock
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.runAsync(query, values);

    if (result.changes === 0) {
      throw new Error('UPDATE_INVENTORY_STOCK_NO_CHANGES');
    }

    return result.changes;
  }

  async createSale(
    id: string,
    total: number,
    createdAt: string
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    await db.runAsync(
      `
      INSERT INTO sale (id, date, total)
      VALUES (?, ?, ?);
    `,
      [id, createdAt, total]
    );
    return id;
  }

  async getSale(id: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.getFirstAsync(
      `
      SELECT * FROM sale
      WHERE id = ?;
    `,
      [id]
    );
    return result ?? null;
  }

  async createSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    await db.runAsync(
      `
      INSERT INTO sale_detail (id, sale_id, product_name, sale_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
      [id, saleId, productName, price, quantity, subtotal]
    );
    return id;
  }

  async getSaleDetailsBySale(saleId: string): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT * FROM sale_detail
      WHERE sale_id = ?;
    `,
      [saleId]
    );
    return rows ?? [];
  }

  async createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean,
    createdAt: string
  ): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const params = [
      id,
      productId,
      code,
      codeType,
      Number(isPrimary),
      createdAt,
    ];
    const placeholders = getPlaceholders(params);
    await db.runAsync(
      `
      INSERT INTO product_code (id, product_id, code, code_type, is_primary, created_at)
      VALUES (${placeholders});
    `,
      params
    );
    return id;
  }

  async updateProductCode(
    id: string,
    code: string,
    codeType: string,
    isPrimary?: boolean
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const fields: string[] = [];
    const values: any[] = [];

    if (code !== undefined) {
      fields.push('code = ?');
      values.push(code);
    }

    if (codeType !== undefined) {
      fields.push('code_type = ?');
      values.push(codeType);
    }

    if (isPrimary !== undefined) {
      fields.push('is_primary = ?');
      values.push(isPrimary);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
      UPDATE product_code
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.runAsync(query, values);

    if (result.changes === 0) {
      throw new Error('UPDATE_PRODUCT_CODE_NO_CHANGES');
    }

    return result.changes;
  }

  async deleteProductCode(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const result = await db.runAsync(`DELETE FROM product_code WHERE id = ?`, [
      id,
    ]);

    if (result.changes === 0) {
      throw new Error('DELETE_PRODUCT_CODE_NOT_FOUND');
    }

    if (result.changes > 1) {
      throw new Error('DELETE_PRODUCT_CODE_UNEXPECTED_MULTIPLE_CHANGES');
    }

    return result.changes;
  }

  async getProductByCode(code: string): Promise<any> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.getFirstAsync(
      `
      SELECT pd.*
      FROM product pd
      JOIN product_code pc
        ON pd.id = pc.product_id
      WHERE pc.code = ?;
    `,
      [code]
    );
    if (result == null) throw new Error('GET_PRODUCT_BY_CODE_NOT_FOUND');
    return result;
  }

  async getCodesByProduct(productId: string): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT * FROM product_code
      WHERE product_id = ?
      ORDER BY is_primary;
    `,
      [productId]
    );
    return rows ?? [];
  }

  async getCodesByProducts(productIds: string[]): Promise<any[]> {
    if (productIds.length === 0) return [];

    const db = (await DB.getInstance('')).connection;
    const placeholders = productIds.map(() => '?').join(',');
    const rows = await db.getAllAsync(
      `
      SELECT *
      FROM product_code
      WHERE product_id IN (${placeholders})
      ORDER BY is_primary DESC;
    `,
      productIds
    );
    return rows ?? [];
  }

  async getAllProductCodes(): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT *
      FROM product_code
    `,
      []
    );
    return rows ?? [];
  }
}

export const stokitoDB: StokitoDatabase = new ApiStokitoDatabase();
