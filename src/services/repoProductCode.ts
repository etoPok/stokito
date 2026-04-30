import { ProductCode } from '../domain/productCode';
import { Product } from '../domain/product';
import { stokitoDB } from './apiStokitoDatabase';

export async function createProductCode(
  id: string,
  productId: string,
  code: string,
  codeType: string,
  isPrimary: boolean
): Promise<ProductCode> {
  await stokitoDB.createProductCode(id, productId, code, codeType, isPrimary);
  return {
    id: id,
    code: code,
    codeType: codeType,
    isPrimary: isPrimary,
  } satisfies ProductCode;
}

export async function getProductByCode(code: string): Promise<Product> {
  const row = await stokitoDB.getProductByCode(code);
  return {
    id: row.id,
    name: row.name,
    costPrice: row.cost_price,
    salePrice: row.sale_price,
    isDiscontinued: row.is_discontinued,
    description: row.description,
    createdAt: row.created_at,
  } satisfies Product;
}

export async function getProductCodes(
  productId: string
): Promise<ProductCode[]> {
  const rows = await stokitoDB.getAllCodesByProduct(productId);
  return rows.map<ProductCode>((r) => {
    return {
      id: r.id,
      code: r.code,
      codeType: r.code_type,
      isPrimary: r.is_primary,
    } satisfies ProductCode;
  });
}
