export type Inventory = {
  id: string;
  name: string;
  location: string;
  date: string;
};

type InventoryRequired = Pick<Inventory, 'id' | 'name' | 'location'>;

export const inventoryRequiredFieldMessages: Record<
  keyof InventoryRequired,
  string
> = {
  id: 'El inventario tiene un id no definido',
  name: 'El nombre del inventario es requerido',
  location: 'La ubicación del inventario es requerida',
};
