export type SaleDatail = {
  id: string;
  saleId: string;
  productName: string;
  salePrice: number;
  subtotal: number;
  quantity: number;
  isVoided: boolean;
};

export type SaleDetailsByProduct = Record<string, SaleDatail>;
