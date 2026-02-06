import { stokitoDB } from "./apiStokitoDatabase";
import Inventory from "../domain/inventory";
import { Product } from "../domain/product";

export async function inventoryRepository(inventory: Inventory) {
  const resultId = await stokitoDB.addInventory(
    inventory.name,
    inventory.location,
    inventory.createdAt,
  );
  inventory.setId(resultId);
}

export async function productRepository(product: Product) {
  const resultId = await stokitoDB.addProduct(
    product.name,
    product.description,
    product.isDiscontinued,
    product.createdAt,
    product.sku,
  );
  product.setId(resultId);
}
