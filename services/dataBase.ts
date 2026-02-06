import * as SQLite from "expo-sqlite";

class Database {
  private static instance: Database | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private databaseName: string = "";

  private constructor() {}

  static async getInstance(databaseName: string) {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.db = await SQLite.openDatabaseAsync(databaseName);
      Database.instance.databaseName = databaseName;
      Database.instance.createDatabase();

      console.log("Database created");
    }

    return Database.instance;
  }

  async createDatabase() {
    await Database.instance!.db!.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS product_definition (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        description TEXT,
        is_discontinued INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        inventory_id INTEGER NOT NULL,
        product_definition_id INTEGER NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (inventory_id)
          REFERENCES inventory(id) ON DELETE CASCADE,

        FOREIGN KEY (product_definition_id)
          REFERENCES product_definition(id) ON DELETE CASCADE,

        UNIQUE (inventory_id, product_definition_id)
      );
    `);
  }

  get connection() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    return this.db;
  }

  public async resetDatabase() {
    await SQLite.deleteDatabaseAsync(Database.instance!.databaseName);
    await SQLite.openDatabaseAsync(Database.instance!.databaseName);
    this.createDatabase();
  }
}

export default Database;
