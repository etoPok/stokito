import { Sale } from '../domain/sale';
import { SaleDetail, SaleDetailsByProduct } from '../domain/saleDetails';
import { stokitoDB } from './apiStokitoDatabase';

export async function createSale(
  id: string,
  date: string,
  total: number
): Promise<Sale> {
  const resultId = await stokitoDB.createSale(id, date, total);
  return { id: resultId, date: date, total: total };
}

export async function getAllSales(): Promise<Sale[]> {
  // type-unsafe
  const rows = await stokitoDB.getAllSales();
  const sales: Sale[] = [];
  rows.forEach((r) => {
    sales.push({ id: r.id, date: r.date, total: r.total });
  });
  return sales;
}

export async function createSaleDetail(
  id: string,
  saleId: string,
  productName: string,
  price: number,
  quantity: number,
  subtotal: number
): Promise<SaleDetail> {
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

export async function getAllSaleDetails(): Promise<SaleDetail[]> {
  const rows = await stokitoDB.getAllSaleDetails();
  const saleDetails: SaleDetail[] = [];
  rows.forEach((r) => {
    saleDetails.push({
      id: r.id,
      saleId: r.sale_id,
      productName: r.product_name,
      salePrice: r.sale_price,
      subtotal: r.subtotal,
      quantity: r.quantity,
      isVoided: r.is_voided,
    });
  });
  return saleDetails;
}

export async function createSaleDetailByProduct(
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
