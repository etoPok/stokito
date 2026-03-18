export type Product = {
  id: string | undefined;
  name: string | undefined;
  barcode: string | undefined;
  salePrice: number | undefined;
  costPrice: number | undefined;
  description: string | undefined;
  isDiscontinued: boolean | undefined;
  createdAt: string | undefined;
};

type ProductRequired = Pick<
  Product,
  'id' | 'name' | 'salePrice' | 'costPrice' | 'isDiscontinued' | 'barcode'
>;

export const productRequiredFieldMessages: Record<
  keyof ProductRequired,
  string
> = {
  id: 'El producto tiene un id no definido',
  name: 'El nombre del producto es requerido',
  salePrice: 'El precio de venta del producto es requerido',
  costPrice: 'El precio de costo del producto es requerido',
  isDiscontinued: 'Debe especificar si el producto esta descontinuado',
  barcode: 'El código de barras del  producto es un campo requerido',
};
