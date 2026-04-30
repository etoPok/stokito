import { Sale } from '../domain/sale';
import { SaleDetail, SaleDetailsByProduct } from '../domain/saleDetails';
import { stokitoDB } from './apiStokitoDatabase';

export async function createSale(id: string, total: number): Promise<Sale> {
  const date = new Date().toISOString();
  await stokitoDB.createSale(id, total, date);
  return { id: id, date: date, total: total };
}

export async function createSaleDetail(
  id: string,
  saleId: string,
  productName: string,
  price: number,
  quantity: number,
  subtotal: number
): Promise<SaleDetail> {
  const sale = await stokitoDB.getSale(saleId);
  if (sale === null) {
    throw new Error(
      `Sale ${saleId} not found for the sale detail being created`
    );
  }
  await stokitoDB.createSaleDetail(
    id,
    saleId,
    productName,
    price,
    subtotal,
    quantity
  );
  return {
    id: id,
    saleId: saleId,
    productName: productName,
    salePrice: price,
    subtotal: subtotal,
    quantity: quantity,
    isVoided: false,
  };
}

export async function createSaleDetailByProducts(
  saleDetails: SaleDetailsByProduct,
  saleId: string
): Promise<void> {
  const saleDetailsKeys = Object.keys(saleDetails);
  for (const key of saleDetailsKeys) {
    const sd = saleDetails[key];
    if (sd.saleId === saleId) {
      await stokitoDB.createSaleDetail(
        sd.id,
        saleId,
        sd.productName,
        sd.salePrice,
        sd.subtotal,
        sd.quantity
      );
    }
  }
}
