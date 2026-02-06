# Base de datos local (expo-sqlite)

### Verificación manual de Integridad

```bash
adb shell
run-as com.anonymous.stokito
cd files/SQLite
sqlite3 stokito
sqlite> PRAGMA integrity_check;
ok
sqlite> .schema
CREATE TABLE product_definition (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        description TEXT,
        is_discontinued INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
CREATE TABLE inventory_item (
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
```
