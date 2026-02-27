import { createContext, useContext, useState, ReactNode } from 'react';
import { SaleDatail } from '../domain/saleDetails';

type SaleDetailContextType = {
  saleDetails: SaleDatail[];
  addSaleDetail: (sd: SaleDatail) => void;
  setSaleDetails: (sd: SaleDatail[]) => void;
};

type SaleDetailProviderProps = {
  children: ReactNode;
};

const SaleDetailContext = createContext<SaleDetailContextType | undefined>(
  undefined
);

export const SaleDetailProvider = ({ children }: SaleDetailProviderProps) => {
  const [saleDetails, setSaleDetailsState] = useState<SaleDatail[]>([]);

  const addSaleDetail = (sd: SaleDatail) => {
    setSaleDetailsState((prev) => [...prev, sd]);
  };

  const setSaleDetails = (sds: SaleDatail[]) => {
    setSaleDetailsState(sds);
  };

  return (
    <SaleDetailContext.Provider
      value={{ saleDetails, addSaleDetail, setSaleDetails }}
    >
      {children}
    </SaleDetailContext.Provider>
  );
};

export const useSaleDetails = (): SaleDetailContextType => {
  const context = useContext(SaleDetailContext);

  if (!context) {
    throw new Error('useSaleDetails must be used within a SaleDetailProvider');
  }

  return context;
};
