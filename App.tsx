import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import Navigation from "./components/roastNavigation";
import DB from "./services/dataBase";
import { ProductProvider } from "./components/productContext";

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    DB.getInstance("stokito").then(() => {
      setDbReady(true);
    });
  }, []);

  if (!dbReady) {
    return null; // loader
  }

  return (
    <SafeAreaProvider>
      <ProductProvider>
        <StatusBar style="light" />
        <Navigation />
      </ProductProvider>
    </SafeAreaProvider>
  );
}
