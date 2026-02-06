import DB from "../services/dataBase";

interface StokitoDatabase {
  addProduct(
    name: string,
    description: string,
    isDiscontinued: boolean,
    createdAt: string,
    sku: string | null,
  ): Promise<number>;
  removeProduct(id: string): Promise<void>;
  findProduct(id: string): Promise<string | null>;

  addInventory(
    name: string,
    location: string,
    createdAt: string,
  ): Promise<number>;
  removeInventory(inventoryId: string): Promise<void>;
  findInventory(inventoryId: string): Promise<string | null>;

  addProductToInventory(
    productId: string,
    inventoryId: string,
  ): Promise<boolean>;
}

class ApiStokitoDatabase implements StokitoDatabase {
  async addProduct(
    name: string,
    description: string,
    isDiscontinued: boolean,
    createdAt: string,
    sku: string | null,
  ): Promise<number> {
    const db = (await DB.getInstance("")).connection;
    const result = await db.runAsync(
      `
      INSERT INTO product_definition (name, sku, description, is_discontinued, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
      [name, sku, description, Number(isDiscontinued), createdAt],
    );

    if (!result) {
      throw new Error("null result in product insertion");
    }

    return result.lastInsertRowId;
  }

  async removeProduct(id: string): Promise<void> {
    return;
  }

  async findProduct(id: string): Promise<string | null> {
    return null;
  }

  async addInventory(
    name: string,
    location: string,
    createdAt: string,
  ): Promise<number> {
    const db = (await DB.getInstance("")).connection;
    const result = await db.runAsync(
      `
      INSERT INTO inventory (name, location, created_at)
      VALUES (?, ?, ?)
    `,
      [name, location, createdAt],
    );

    if (!result) {
      throw new Error("null result in inventory insertion");
    }

    return result.lastInsertRowId;
  }

  async removeInventory(inventory: string): Promise<void> {
    return;
  }

  async findInventory(inventoryId: string): Promise<string | null> {
    return null;
  }

  async addProductToInventory(
    productId: string,
    inventoryId: string,
  ): Promise<boolean> {
    return false;
  }
}

export const stokitoDB: StokitoDatabase = new ApiStokitoDatabase();
