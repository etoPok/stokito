import { useRef, useCallback, useReducer } from 'react';
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
  const [, forceRender] = useReducer((x) => x + 1, 0);
  const saleId = useRef<string | null>(null);
  const saleDetails = useRef<SaleDetailsByProduct>({});
  const currentDetail = useRef<SaleDetail | undefined>(undefined);
  const snapshot = useRef<{
    saleId: React.RefObject<string | null>;
    saleDetails: React.RefObject<SaleDetailsByProduct>;
  }>({ saleId: saleId, saleDetails: saleDetails });

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

      forceRender();
    },
    [getOrCreateSaleDetail]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const detail = saleDetails.current[productId];
    if (!detail) return;

    if (detail.quantity === 1 && quantity < 0) return;

    detail.quantity += quantity;
    detail.subtotal = detail.salePrice * detail.quantity;
    forceRender();
  }, []);

  const getSnapshot = useCallback(
    (): {
      saleId: React.RefObject<string | null>;
      saleDetails: React.RefObject<SaleDetailsByProduct>;
    } => snapshot.current,
    []
  );

  const removeProduct = useCallback((productId: string) => {
    const { [productId]: _, ...resto } = saleDetails.current;
    saleDetails.current = resto;

    forceRender();
  }, []);

  const getTotal = useCallback((): number => {
    let total = 0;
    for (const key in saleDetails.current) {
      total += saleDetails.current[key as keyof typeof saleDetails].subtotal;
    }
    return total;
  }, []);

  const getSubtotal = useCallback((productId: string): number => {
    return saleDetails.current[productId].subtotal;
  }, []);

  const hasActiveSale = () => saleId.current != null;

  return {
    addProduct,
    getSnapshot,
    hasActiveSale,
    updateQuantity,
    removeProduct,
    getSubtotal,
    getTotal,
  };
}
