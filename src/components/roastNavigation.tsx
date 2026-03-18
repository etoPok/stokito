import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './../screens/homeScreen';
import { InventoriesScreen } from './../screens/inventoriesScreen';
import { CheckoutScreen } from './../screens/checkoutScreen';
import { RefundScreen } from './../screens/refundScreen';
import { ProductsScreen } from './../screens/productsScreen';
import { ConfirmSaleScreen } from './../screens/confirmSaleScreen';
import { SalesScreen } from './../screens/salesScreen';
import { ProductScreen } from '../screens/productScreen';
import { InventoryProductScreen } from '../screens/inventoryProductScreen';
import { InventoryScreen } from '../screens/inventoryScreen';
import { BarcodeScannerScreen } from '../screens/barcodeScannerScreen';

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
    RefundScreen: {
      screen: RefundScreen,
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
    ConfirmSaleScreen: {
      screen: ConfirmSaleScreen,
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
    InventoriesScreen: {
      screen: InventoriesScreen,
      options: {
        headerShown: false,
      },
    },
    BarcodeScannerScreen: {
      screen: BarcodeScannerScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
