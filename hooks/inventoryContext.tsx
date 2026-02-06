import { createContext, useContext, useState, ReactNode } from 'react';
import Inventory from '../domain/inventory';

type InventoryContextType = {
  inventories: Inventory[];
  addInventory: (inventory: Inventory) => void;
  setInventories: (inventories: Inventory[]) => void;
};

type InventoryProviderProps = {
  children: ReactNode;
};

const IventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [inventories, setInventoriesState] = useState<Inventory[]>([]);

  const addInventory = (inventory: Inventory) => {
    setInventoriesState((prev) => [...prev, inventory]);
  };

  const setInventories = (inventories: Inventory[]) => {
    setInventoriesState(inventories);
  };

  return (
    <IventoryContext.Provider
      value={{ inventories, addInventory, setInventories }}
    >
      {children}
    </IventoryContext.Provider>
  );
};

export const useInventories = (): InventoryContextType => {
  const context = useContext(IventoryContext);

  if (!context) {
    throw new Error('useInventories must be used within a InventorysProvider');
  }

  return context;
};
