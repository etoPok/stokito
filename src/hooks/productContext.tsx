import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../domain/product';
import repository from '../services/repositories';
import { ProductCode } from '../domain/productCode';

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product, productCode: ProductCode[]) => Promise<void>;
  pullProducts: () => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
};

type ProductProviderProps = {
  children: ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProductsState] = useState<Product[]>([]);

  const addProduct = async (product: Product, productCode: ProductCode[]) => {
    try {
      await repository.setProduct(
        product.id!,
        product.name!,
        product.salePrice!,
        product.costPrice!,
        product.description!,
        product.isDiscontinued!,
        productCode
      );
      setProductsState((prev) => [...prev, product]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (productId: string) => {
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return;
    const copy = [...products];
    copy.slice(index, 1);
    await repository.removeProduct(productId);
    setProductsState(copy);
  };

  const pullProducts = async () => {
    const results = await repository.getAllProducts();
    setProductsState(results);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, pullProducts, removeProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProcducts must be used within a ProductProvider');
  }

  return context;
};
