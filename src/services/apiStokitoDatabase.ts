import DB from '../services/dataBase';

interface StokitoDatabase {
  createProduct(
    id: string,
    name: string,
    salePrice: number,
    costPrice: number,
    description: string | undefined,
    isDiscontinued: boolean,
    createdAt: string
  ): Promise<string>;
  deleteProduct(id: string): Promise<number>;
  getProduct(id: string): Promise<any>;
  getAllProducts(): Promise<any[]>;
  updateProduct(
    id: string,
    name?: string,
    description?: string,
    isDiscontinued?: boolean,
    salePrice?: number,
    costPrice?: number
  ): Promise<number>;

  createInventory(
    id: string,
    name: string,
    location: string,
    createdAt: string
  ): Promise<string>;
  deleteInventory(id: string): Promise<number>;
  getInventory(id: string): Promise<any>;
  getAllInventories(): Promise<any[]>;
  updateInventory(
    id: string,
    name?: string,
    location?: string
  ): Promise<number>;

  createInventoryProduct(
    id: string,
    productId: string,
    inventoryId: string,
    stock: number,
    createdAt: string
  ): Promise<number>;
  getInventoryProducts(inventoryId: string): Promise<any[]>;
  updateInventoryProduct(
    id: string,
    inventoryId?: string,
    stock?: number
  ): Promise<number>;

  createSale(id: string, date: string, total: number): Promise<string>;
  getAllSales(): Promise<any[]>;
  createSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number,
    isVoided: boolean
  ): Promise<string>;
  getAllSaleDetails(): Promise<any[]>;

  createProductCode(
    id: string,
    productId: string,
    code: string,
    codeType: string,
    isPrimary: boolean
  ): Promise<string>;
  deleteProductCode(id: string): Promise<number>;
  updateProductCode(
    id: string,
    code: string,
    codeType: string,
    isPrimary?: boolean
  ): Promise<number>;
  getProductByCode(code: string): Promise<any>;
  getProductCodes(productId: string): Promise<any[]>;
}

class ApiStokitoDatabase implements StokitoDatabase {
  async createProduct(
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
    await db.runAsync(
      `
        INSERT INTO product_definition (id, name, sale_price, cost_price, description, is_discontinued, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        id,
        name,
        salePrice,
        costPrice,
        description ?? null,
        Number(isDiscontinued),
        createdAt,
      ]
    );
    return id;
  }

  async deleteProduct(id: string): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const result = await db.runAsync(
      `DELETE FROM product_definition WHERE id = ?`,
      [id]
    );

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
      SELECT * FROM product_definition WHERE id = ?;
    `,
      [id]
    );
    if (!row) {
      throw new Error(`GET_PRODUCT_NOT_FOUND`);
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
    return rows ?? [];
  }

  async updateProduct(
    id: string,
    name?: string,
    description?: string,
    isDiscontinued?: boolean,
    salePrice?: number,
    costPrice?: number
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;

    const fields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }

    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }

    if (isDiscontinued !== undefined) {
      fields.push('is_discontinued = ?');
      values.push(Number(isDiscontinued));
    }

    if (salePrice !== undefined) {
      fields.push('sale_price = ?');
      values.push(salePrice);
    }

    if (costPrice !== undefined) {
      fields.push('cost_price = ?');
      values.push(costPrice);
    }

    if (fields.length === 0) {
      return 0;
    }

    values.push(id);

    const query = `
    UPDATE product_definition
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
    if (!row) {
      throw new Error('GET_INVENTORY_NOT_FOUND');
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
    return rows ?? [];
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

  async createInventoryProduct(
    id: string,
    productId: string,
    inventoryId: string,
    stock: number,
    createdAt: string
  ): Promise<number> {
    const db = (await DB.getInstance('')).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory_product (id, product_id, inventory_id, stock, created_at)
      VALUES (?, ?, ?, ?, ?);
    `,
      [id, productId, inventoryId, stock, createdAt]
    );
    return result.lastInsertRowId;
  }

  async getInventoryProducts(inventoryId: string): Promise<any[]> {
    const db = (await DB.getInstance('')).connection;
    const rows = await db.getAllAsync(
      `
      SELECT
        pd.id AS product_id,
        pd.name,
        pd.sale_price,
        pd.cost_price,
        pd.is_discontinued,
        pd.description,
        ii.id,
        ii.created_at,
        ii.stock
      FROM inventory_product ii
      JOIN product_definition pd ON pd.id = ii.product_id
      WHERE ii.inventory_id = ?;
    `,
      [inventoryId]
    );
    return rows ?? [];
  }

  async updateInventoryProduct(
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
    UPDATE inventory_product
    SET ${fields.join(', ')}
    WHERE id = ?
  `;

    const result = await db.runAsync(query, values);

    if (result.changes === 0) {
      throw new Error('UPDATE_INVENTORY_PRODUCT_NO_CHANGES');
    }

    return result.changes;
  }

  async createSale(id: string, date: string, total: number): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    await db.runAsync(
      `
      INSERT INTO sale (id, date, total)
      VALUES (?, ?, ?);
    `,
      [id, date, total]
    );
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
    return results ?? [];
  }

  async createSaleDetail(
    id: string,
    saleId: string,
    productName: string,
    price: number,
    subtotal: number,
    quantity: number,
    isVoided: boolean
  ): Promise<string> {
    const db = (await DB.getInstance('')).connection;
    await db.runAsync(
      `
      INSERT INTO sale_detail (id, sale_id, product_name, sale_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
      [id, saleId, productName, price, quantity, subtotal, Number(isVoided)]
    );
    return id;
  }

  async getAllSaleDetails(): Promise<any[]> {
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
    await db.runAsync(
      `
      INSERT INTO product_code (id, product_id, code, code_type, is_primary)
      VALUES (?, ?, ?, ?, ?);
    `,
      [id, productId, code, codeType, Number(isPrimary)]
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
      FROM product_definition pd
      JOIN product_code pc
        ON pd.id = pc.product_id
      WHERE pc.code = ?;
    `,
      [code]
    );
    if (result == null) throw new Error('GET_PRODUCT_BY_CODE_NOT_FOUND');
    return result;
  }

  async getProductCodes(productId: string): Promise<any[]> {
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
    return rows ?? [];
  }
}

export const stokitoDB: StokitoDatabase = new ApiStokitoDatabase();
