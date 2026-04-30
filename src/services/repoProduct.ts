import { Product } from '../domain/product';
import { ProductCode } from '../domain/productCode';
import { stokitoDB } from './apiStokitoDatabase';
import { v4 as uuid } from 'uuid';

export type CreateProductInput = {
  name: string;
  salePrice: number;
  costPrice: number;
  productCodes: ProductCode[];
  isDiscontinued: boolean;
  description?: string;
};

function assembleProduct(product: any, codes: any[]): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    salePrice: product.sale_price,
    costPrice: product.cost_price,
    isDiscontinued: Boolean(product.is_discontinued),
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

export async function createProduct({
  name,
  salePrice,
  costPrice,
  productCodes,
  isDiscontinued,
  description,
}: CreateProductInput): Promise<Product> {
  const date = new Date().toISOString();
  const productId = uuid();

  await stokitoDB.createProduct(
    productId,
    name,
    salePrice,
    costPrice,
    isDiscontinued,
    date,
    description
  );

  const codes: ProductCode[] = [];
  try {
    for (const pc of productCodes) {
      const productCodeId = uuid();
      await stokitoDB.createProductCode(
        productCodeId,
        productId,
        pc.code,
        pc.codeType,
        pc.isPrimary,
        date
      );
      codes.push({
        id: productCodeId,
        code: pc.code,
        codeType: pc.codeType,
        isPrimary: pc.isPrimary,
        createdAt: date,
      });
    }
  } catch (error) {
    await stokitoDB.deleteProduct(productId);
    throw error;
  }

  return {
    id: productId,
    name: name,
    description: description ?? '',
    salePrice: salePrice,
    costPrice: costPrice,
    isDiscontinued: isDiscontinued,
    codes: codes,
    createdAt: date,
  };
}

export async function getProductPage(
  cursor: number,
  limit: number
): Promise<{ items: Product[]; nextCursor: number | null }> {
  const products = await stokitoDB.getProductPage(cursor, limit);
  if (products.length === 0) return { items: [], nextCursor: null };

  const productIds = products.map((p) => p.id);
  const codes = await stokitoDB.getCodesByProducts(productIds);

  return {
    items: products.map((p) => assembleProduct(p, codes)),
    nextCursor:
      products.length === limit ? (products.at(-1)?.rowid ?? null) : null,
  };
}

export async function deleteProduct(id: string): Promise<boolean> {
  const changes = await stokitoDB.deleteProduct(id);
  return changes === 1;
}

export async function updateProduct(
  id: string,
  changes: Partial<Product>
): Promise<void> {
  try {
    if (changes.codes) {
      const pcs = await stokitoDB.getCodesByProduct(id);
      const date = new Date().toISOString();

      for (const pc of changes.codes) {
        const existingProductCode = pcs.find((value) => value.id === pc.id);
        if (existingProductCode) {
          await stokitoDB.updateProductCode(pc.id, pc.code, pc.codeType);
        } else {
          await stokitoDB.createProductCode(
            uuid(),
            id,
            pc.code,
            pc.codeType,
            pc.isPrimary,
            date
          );
        }
      }
    }

    await stokitoDB.updateProduct(
      id,
      changes.name,
      changes.salePrice,
      changes.costPrice,
      changes.description,
      changes.isDiscontinued
    );
  } catch (error) {
    console.log(error);
  }
}
