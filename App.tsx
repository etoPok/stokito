import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navigation from './src/components/roastNavigation';
import DB from './src/services/dataBase';

import { AppThemeProvider } from './src/hooks/useAppTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await DB.getInstance('stokito.db');
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
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider>
            <StatusBar style="light" />
            <Navigation />
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  );
}
