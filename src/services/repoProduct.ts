import { Product } from '../domain/product';
import { ProductCode } from '../domain/productCode';
import { stokitoDB } from './apiStokitoDatabase';
import { v4 as uuid } from 'uuid';

export async function createProduct(
  name: string,
  variantName: string,
  salePrice: number,
  costPrice: number,
  productCodes: ProductCode[],
  isDefault: boolean,
  isDiscontinued: boolean,
  description?: string
): Promise<Product> {
  const date = new Date().toISOString();
  const productId = uuid();
  const productVariantId = uuid();

  await stokitoDB.createProduct(
    productId,
    name,
    description,
    isDiscontinued,
    date
  );

  try {
    for (const pc of productCodes) {
      const productCodeId = uuid();
      await stokitoDB.createProductCode(
        productCodeId,
        productId, // codigos relacionados con entidad product
        pc.code,
        pc.codeType,
        pc.isPrimary
      );
    }
  } catch (error) {
    await stokitoDB.deleteProduct(productId);
    throw error;
  }

  await stokitoDB.createProductVariant(
    productVariantId,
    variantName,
    salePrice,
    costPrice,
    isDefault,
    date
  );

  return {
    id: productId,
    productVariantId: productVariantId,
    name: name,
    variantName: variantName,
    salePrice: salePrice,
    costPrice: costPrice,
    description: description ?? '',
    productCodes: productCodes,
    isDiscontinued: isDiscontinued,
    isDefault: isDefault,
    createdAt: date,
  } satisfies Product;
}

export async function getProducts(): Promise<Product[]> {
  // type-unsafe
}

export async function getProduct(id: string): Promise<Product> {
  const productDefintion = await stokitoDB.getProduct(id);
  // const productVariants = await stokitoDB.getProductVariants
  return {
    id: row.id,
    name: row.name,
    salePrice: row.sale_price,
    costPrice: row.cost_price,
    description: row.description,
    isDiscontinued: row.is_discontinued,
    createdAt: row.created_at,
  } satisfies Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const changes = await stokitoDB.deleteProduct(id);
  return changes === 1;
}

export async function updateProduct(
  id: string,
  productVariantId: string,
  name?: string,
  variantName?: string,
  description?: string,
  salePrice?: number,
  costPrice?: number,
  productCodes?: ProductCode[],
  isDiscontinued?: boolean,
  isDefault?: boolean
): Promise<void> {
  try {
    await stokitoDB.updateProduct(id, name, description, isDiscontinued);
    await stokitoDB.updateProductVariant(
      productVariantId,
      variantName,
      salePrice,
      costPrice,
      isDefault
    );
    if (productCodes) {
      const pcs = await stokitoDB.getAllCodesByProduct(id);
      for (const pc of productCodes) {
        const existingProductCode = pcs.find((value) => value.id === pc.id);
        if (existingProductCode) {
          await stokitoDB.updateProductCode(pc.id, pc.code, pc.codeType);
        } else {
          await stokitoDB.createProductCode(
            uuid(),
            id,
            pc.code,
            pc.codeType,
            pc.isPrimary
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
