import { InventoryProduct } from '../domain/inventoryProduct';
import { ProductCode } from '../domain/productCode';
import { stokitoDB } from './apiStokitoDatabase';
import { v4 as uuid } from 'uuid';

export type CreateInventoryProductInput = {
  inventoryId: string;
  name: string;
  salePrice: number;
  costPrice: number;
  codes: ProductCode[];
  stock: number;
  isDiscontinued: boolean;
  description?: string;
};

function assembleInventoryProduct(
  product: any,
  codes: any[],
  inventoryStocks: any[],
  inventories: any[]
): InventoryProduct | null {
  const inventoryStock = inventoryStocks.find(
    (i) => i.product_id === product.id
  );
  if (!inventoryStock) return null;

  const inventory = inventories.find(
    (i) => i.id === inventoryStock.inventory_id
  );
  if (!inventory) return null;

  return {
    id: inventoryStock.id,
    productId: product.id,
    name: product.name,
    description: product.description,
    salePrice: product.sale_price,
    costPrice: product.cost_price,
    isDiscontinued: Boolean(product.is_discontinued),
    inventoryStock: {
      id: inventoryStock.id,
      stock: inventoryStock.stock,
      inventory: {
        id: inventory.id,
        name: inventory.name,
        location: inventory.location,
        createdAt: inventory.created_at,
      },
      createdAt: inventoryStock.created_at,
    },
    codes: codes
      .filter((c) => c.product_id === product.id)
      .map((c) => ({
        id: c.id,
        code: c.code,
        codeType: c.code_type,
        isPrimary: Boolean(c.is_primary),
        createdAt: c.created_at,
      })),
    createdAt: product.created_at,
  };
}

/**
 * Create product and inventory stock. This function does not create a new inventory
 *
 * @param inventoryId inventory id that will contain the product
 */
export async function createInventoryProduct({
  inventoryId,
  name,
  salePrice,
  costPrice,
  codes,
  stock,
  isDiscontinued,
  description,
}: CreateInventoryProductInput): Promise<InventoryProduct> {
  const date = new Date().toISOString();
  const productId = uuid();
  const inventoryStockId = uuid();

  const inventory = await stokitoDB.getInventory(inventoryId);

  await stokitoDB.createProduct(
    productId,
    name,
    salePrice,
    costPrice,
    isDiscontinued,
    date,
    description
  );

  await stokitoDB.createInventoryStock(
    inventoryStockId,
    productId,
    inventoryId,
    stock,
    date
  );

  try {
    for (const pc of codes) {
      const productCodeId = uuid();
      await stokitoDB.createProductCode(
        productCodeId,
        productId,
        pc.code,
        pc.codeType,
        pc.isPrimary,
        date
      );
    }
  } catch (error) {
    await stokitoDB.deleteProduct(productId);
    throw error;
  }

  return {
    id: inventoryStockId,
    productId: productId,
    name: name,
    description: description ?? '',
    salePrice: salePrice,
    costPrice: costPrice,
    inventoryStock: {
      id: inventoryStockId,
      stock: stock,
      inventory: {
        id: inventory.id,
        name: inventory.name,
        location: inventory.location,
        createdAt: inventory.created_at,
      },
      createdAt: date,
    },
    isDiscontinued: isDiscontinued,
    codes: codes,
    createdAt: date,
  };
}

export async function getInventoryProductPage(
  cursor: number,
  limit: number
): Promise<{ items: InventoryProduct[]; nextCursor: number | null }> {
  const products = await stokitoDB.getProductPage(cursor, limit);
  if (products.length === 0) return { items: [], nextCursor: null };

  const productIds = products.map((p) => p.id);
  const codes = await stokitoDB.getCodesByProducts(productIds);

  const inventoryStocks =
    await stokitoDB.getInventoryStocksByProducts(productIds);
  const inventoryIds = inventoryStocks.map((i) => i.inventory_id);
  const inventories = await stokitoDB.getInventories(inventoryIds);

  return {
    items: products
      .map((p) =>
        assembleInventoryProduct(p, codes, inventoryStocks, inventories)
      )
      .filter((item): item is InventoryProduct => item !== null),
    nextCursor: products.at(-1)?.rowid ?? null,
  };
}

export async function deleteInventoryProduct(id: string): Promise<boolean> {
  const changes = await stokitoDB.deleteProduct(id);
  return changes === 1;
}

/**
 * Update the inventory product
 *
 * @returns Changes including IDs of created records. Use these changes to overwrite the local object.
 */
export async function updateInventoryProduct(
  id: string,
  changes: Partial<CreateInventoryProductInput>
): Promise<InventoryProduct> {
  try {
    const inventoryStock = await stokitoDB.getInventoryStock(id);
    if (inventoryStock === null || inventoryStock.product_id == null) {
      throw new Error(`InventoryStock ${id} not found`);
    }
    const productId = inventoryStock.product_id;

    const codes: ProductCode[] = (
      (await stokitoDB.getCodesByProduct(productId)) ?? []
    ).map(
      (c) =>
        ({
          id: c.id,
          code: c.code,
          codeType: c.code_type,
          isPrimary: Boolean(c.is_primary),
          createdAt: c.created_at,
        }) satisfies ProductCode
    );

    if (changes.codes) {
      const date = new Date().toISOString();

      for (const pc of changes.codes) {
        const existingProductCode = codes.find((c) => c.id === pc.id);

        if (existingProductCode) {
          await stokitoDB.updateProductCode(pc.id, pc.code, pc.codeType);
          continue;
        }

        pc.id = uuid();
        await stokitoDB.createProductCode(
          pc.id,
          productId,
          pc.code,
          pc.codeType,
          pc.isPrimary,
          date
        );
      }

      changes.codes = codes;
    }

    await stokitoDB.updateProduct(
      productId,
      changes.name,
      changes.salePrice,
      changes.costPrice,
      changes.description,
      changes.isDiscontinued
    );

    await stokitoDB.updateInventoryStock(
      id,
      changes.inventoryId,
      changes.stock
    );

    const product = await stokitoDB.getProduct(productId);
    const updatedInventoryStock = await stokitoDB.getInventoryStock(id);
    const inventory = await stokitoDB.getInventory(
      updatedInventoryStock.inventory_id
    );

    return {
      id: updatedInventoryStock.id,
      productId: product.id,
      name: product.name,
      description: product.description,
      salePrice: product.sale_price,
      costPrice: product.cost_price,
      isDiscontinued: Boolean(product.is_discontinued),
      inventoryStock: {
        id: updatedInventoryStock.id,
        stock: updatedInventoryStock.stock,
        inventory: {
          id: inventory.id,
          name: inventory.name,
          location: inventory.location,
          createdAt: inventory.created_at,
        },
        createdAt: updatedInventoryStock.created_at,
      },
      codes,
      createdAt: product.created_at,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * Create an inventory stock for an existing product
 *
 * @param productId existing produc ID
 * @param inventoryID inventory ID that will contain the product
 */
export async function addProductToInventory(
  productId: string,
  inventoryId: string,
  stock: number
): Promise<InventoryProduct> {
  const product = await stokitoDB.getProduct(productId);
  const codes = await stokitoDB.getCodesByProduct(productId);
  const inventory = await stokitoDB.getInventory(inventoryId);

  const inventoryStockId = uuid();
  const date = new Date().toISOString();

  await stokitoDB.createInventoryStock(
    inventoryStockId,
    productId,
    inventoryId,
    stock,
    date
  );

  return {
    id: inventoryStockId,
    productId: product.id,
    name: product.name,
    salePrice: product.sale_price,
    costPrice: product.cost_price,
    description: product.description,
    isDiscontinued: Boolean(product.is_discontinued),
    createdAt: date,
    codes: codes.map(
      (c) =>
        ({
          id: c.id,
          code: c.code,
          codeType: c.code_type,
          isPrimary: Boolean(c.is_primary),
          createdAt: c.created_at,
        }) satisfies ProductCode
    ),
    inventoryStock: {
      id: inventoryStockId,
      stock: stock,
      createdAt: date,
      inventory: {
        id: inventory.id,
        name: inventory.name,
        location: inventory.location,
        createdAt: inventory.created_at,
      },
    },
  };
}

export async function isProductInInventory(
  productId: string
): Promise<boolean> {
  const result = await stokitoDB.getInventoryStockByProduct(productId);
  return result !== null;
}
