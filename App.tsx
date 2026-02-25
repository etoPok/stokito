import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import Navigation from './components/roastNavigation';
import DB from './services/dataBase';
import { ProductProvider } from './hooks/productContext';
import { InventoryProvider } from './hooks/inventoryContext';
import { SaleDetailProvider } from './hooks/saleDetailsContext';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await DB.getInstance('stokito');
        setDbReady(true);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    initDatabase();
  }, []);

  if (!dbReady) {
    return null; // loader
  }

  return (
    <SafeAreaProvider>
      <ProductProvider>
        <InventoryProvider>
          <SaleDetailProvider>
            <StatusBar style="light" />
            <Navigation />
          </SaleDetailProvider>
        </InventoryProvider>
      </ProductProvider>
    </SafeAreaProvider>
  );
}
