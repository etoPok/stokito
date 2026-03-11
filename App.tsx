import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';

import Navigation from './src/components/roastNavigation';
import DB from './src/services/dataBase';
import { ProductProvider } from './src/hooks/productContext';
import { InventoryProvider } from './src/hooks/inventoryContext';

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
          <PaperProvider>
            <StatusBar style="light" />
            <Navigation />
          </PaperProvider>
        </InventoryProvider>
      </ProductProvider>
    </SafeAreaProvider>
  );
}
