import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import Navigation from './components/roastNavigation';
import DB from './services/dataBase';
import { ProductProvider } from './hooks/productContext';
import { InventoryProvider } from './hooks/inventoryContext';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      DB.getInstance('stokito').then(() => {
        setDbReady(true);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, []);

  if (!dbReady) {
    return null; // loader
  }

  return (
    <SafeAreaProvider>
      <ProductProvider>
        <InventoryProvider>
          <StatusBar style="light" />
          <Navigation />
        </InventoryProvider>
      </ProductProvider>
    </SafeAreaProvider>
  );
}
