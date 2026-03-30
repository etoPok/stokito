import { useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../domain/product';
import { SaleDetailsByProduct, SaleDetail } from '../domain/saleDetails';

function createSaleDetail(saleId: string, product: Product): SaleDetail {
  return {
    id: uuidv4(),
    saleId,
    productName: product.name!,
    salePrice: 0,
    quantity: 0,
    subtotal: 0,
    isVoided: false,
  };
}

export function useSale() {
  const saleId = useRef<string | null>(null);
  const saleDetails = useRef<SaleDetailsByProduct>({});
  const currentDetail = useRef<SaleDetail | undefined>(undefined);

  const getOrCreateSaleDetail = useCallback((product: Product): SaleDetail => {
    const existing = saleDetails.current[product.id!];
    if (existing) return existing;

    const newDetail = createSaleDetail(saleId.current!, product);
    saleDetails.current[product.id!] = newDetail;
    return newDetail;
  }, []);

  const addProduct = useCallback(
    (product: Product) => {
      if (saleId.current == null) {
        saleId.current = uuidv4();
      }

      const detail = getOrCreateSaleDetail(product);
      detail.salePrice = product.salePrice!;
      detail.quantity += 1;
      detail.subtotal = detail.salePrice * detail.quantity;
      currentDetail.current = detail;
    },
    [getOrCreateSaleDetail]
  );

  const getSnapshot = useCallback(
    (): { saleId: string | null; saleDetails: SaleDetailsByProduct } => ({
      saleId: saleId.current,
      saleDetails: saleDetails.current,
    }),
    []
  );

  const hasActiveSale = () => saleId.current != null;

  return { addProduct, getSnapshot, hasActiveSale };
}
