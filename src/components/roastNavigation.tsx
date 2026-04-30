import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './../screens/homeScreen';
import { CheckoutScreen } from './../screens/checkoutScreen';
import { ProductsScreen } from './../screens/productsScreen';
import { SalesScreen } from './../screens/salesScreen';
import { ProductScreen } from '../screens/productScreen';
import { InventoryProductScreen } from '../screens/inventoryProductScreen';
import { InventoryScreen } from '../screens/inventoryScreen';
import { CcodeScannerScreen } from '../screens/codeScannerScreen';
import { PreferencesScreen } from '../screens/preferencesScreen';

const RootStack = createNativeStackNavigator({
  screens: {
    HomeScreen: {
      screen: HomeScreen,
      options: {
        headerShown: false,
      },
    },
    InventoryScreen: {
      screen: InventoryScreen,
      options: {
        headerShown: false,
      },
    },
    CheckoutScreen: {
      screen: CheckoutScreen,
      options: {
        headerShown: false,
      },
    },
    ProductsScreen: {
      screen: ProductsScreen,
      options: {
        headerShown: false,
      },
    },
    SalesScreen: {
      screen: SalesScreen,
      options: {
        headerShown: false,
      },
    },
    ProductScreen: {
      screen: ProductScreen,
      options: {
        headerShown: false,
      },
    },
    InventoryProductScreen: {
      screen: InventoryProductScreen,
      options: {
        headerShown: false,
      },
    },
    CodeScannerScreen: {
      screen: CcodeScannerScreen,
      options: {
        headerShown: false,
      },
    },
    PreferencesScreen: {
      screen: PreferencesScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
