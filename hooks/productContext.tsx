import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../domain/product';

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
};

type ProductProviderProps = {
  children: ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProductsState] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProductsState((prev) => [...prev, product]);
  };

  const setProducts = (products: Product[]) => {
    setProductsState(products);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProcducts must be used within a ProductsProvider');
  }

  return context;
};
