import { createContext, useContext, useState, ReactNode } from 'react';
import { Inventory } from '../domain/inventory';
import repository from '../services/repositories';

type InventoryContextType = {
  inventories: Inventory[];
  addInventory: (inventory: Inventory) => Promise<void>;
  pullInventories: () => Promise<void>;
  removeInventory: (inventoryId: string) => Promise<void>;
};

type InventoryProviderProps = {
  children: ReactNode;
};

const IventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [inventories, setInventories] = useState<Inventory[]>([]);

  const addInventory = async (inventory: Inventory) => {
    try {
      await repository.setInventory(
        inventory.id,
        inventory.name,
        inventory.location
      );
      setInventories((prev) => [...prev, inventory]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeInventory = async (inventoryId: string) => {
    const index = inventories.findIndex((i) => i.id === inventoryId);
    if (index === -1) return;
    const copy = [...inventories];
    copy.splice(index, 1);
    await repository.removeInventory(inventoryId);
    setInventories(copy);
  };

  const pullInventories = async () => {
    const results = await repository.getAllInventories();
    setInventories(results);
  };

  return (
    <IventoryContext.Provider
      value={{ inventories, addInventory, pullInventories, removeInventory }}
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
