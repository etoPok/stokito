import { Inventory } from './inventory';

export type InventoryProduct = {
  id: string | undefined;
  name: string | undefined;
  sku: string | undefined;
  salePrice: number | undefined;
  costPrice: number | undefined;
  description: string | undefined;
  isDiscontinued: boolean | undefined;
  createdAt: string | undefined;
  stok: number | undefined;
  inventory: Inventory | undefined;
};

type InventoryProductRequired = Pick<
  InventoryProduct,
  | 'id'
  | 'name'
  | 'salePrice'
  | 'costPrice'
  | 'isDiscontinued'
  | 'stok'
  | 'inventory'
>;

export const inventoryProductRequiredFieldsMessages: Record<
  keyof InventoryProductRequired,
  string
> = {
  id: 'El producto de inventario tiene un id no definido',
  name: 'El nombre del producto es requerido',
  salePrice: 'El precio de venta del producto es requerido',
  costPrice: 'El precio de costo del producto es requerido',
  isDiscontinued: 'Debe especificar si el producto esta descontinuado',
  stok: 'El stok del producto es requerido',
  inventory: 'El inventario del producto es un campo requerido',
};
