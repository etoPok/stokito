import { Product } from '../domain/product';
import { ProductCode } from '../domain/productCode';
import { stokitoDB } from './apiStokitoDatabase';

export async function getProductByCode(code: string): Promise<Product> {
  const product = await stokitoDB.getProductByCode(code);
  const codes = await stokitoDB.getCodesByProduct(product.id);

  return {
    id: product.id,
    name: product.name,
    costPrice: product.cost_price,
    salePrice: product.sale_price,
    isDiscontinued: product.is_discontinued,
    description: product.description,
    codes: codes.map(
      (c) =>
        ({
          id: c.id,
          code: c.code,
          codeType: c.code_type,
          isPrimary: c.is_primary,
          createdAt: c.created_at,
        }) satisfies ProductCode
    ),
    createdAt: product.created_at,
  } satisfies Product;
}
