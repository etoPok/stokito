import * as SQLite from 'expo-sqlite';

class Database {
  private static instance: Database | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private databaseName: string = '';

  private constructor() {}

  static async getInstance(databaseName: string): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.db = await SQLite.openDatabaseAsync(databaseName);
      Database.instance.databaseName = databaseName;
      await Database.instance.createDatabase();

      console.log('Database created');
    }

    return Database.instance;
  }

  async createDatabase() {
    await Database.instance!.db!.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS product_definition (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        description TEXT,
        is_discontinued INTEGER DEFAULT 0,
        sale_price INTEGER NOT NULL,
        cost_price INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inventory_id TEXT NOT NULL,
        product_definition_id TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (inventory_id)
          REFERENCES inventory(id) ON DELETE CASCADE,

        FOREIGN KEY (product_definition_id)
          REFERENCES product_definition(id) ON DELETE CASCADE,

        UNIQUE (inventory_id, product_definition_id)
      );

      CREATE TABLE IF NOT EXISTS sale (
        id TEXT PRIMARY KEY,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        total INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sale_product (
        id TEXT PRIMARY KEY,
        sale_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal INTEGER NOT NULL,
        is_voided INTEGER NOT NULL DEFAULT 0,

        FOREIGN KEY (sale_id)
          REFERENCES sale(id) ON DELETE CASCADE
      );
    `);
  }

  get connection() {
    if (this.db === null) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  public async resetDatabase() {
    if (Database.instance === null)
      throw new Error('Database instance not initialized');

    // Close current database
    const _db = Database.instance.connection;
    await _db.closeAsync();

    // Delete and open database
    await SQLite.deleteDatabaseAsync(Database.instance.databaseName);
    Database.instance.db = await SQLite.openDatabaseAsync(
      Database.instance.databaseName
    );

    // Create database
    await Database.instance.createDatabase();
    console.log('Reset database');
  }
}

export default Database;
