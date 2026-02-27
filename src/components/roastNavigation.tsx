import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './../screens/homeScreen';
import { InventoryScreen } from './../screens/inventoriesScreen';
import { CheckoutScreen } from './../screens/checkoutScreen';
import { RefundScreen } from './../screens/refundScreen';
import { CreateInventoryProductScreen } from './../screens/createInventoryProductScreen';
import { CreateInventoryScreen } from './../screens/createInventoryScreen';
import { ProductsScreen } from './../screens/productsScreen';
import { CreateProductDefinitionScreen } from './../screens/createProductDefinitionScreen';
import { ConfirmSaleScreen } from './../screens/confirmSaleScreen';
import { SalesScreen } from './../screens/salesScreen';

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
    CreateProductDefinitionScreen: {
      screen: CreateProductDefinitionScreen,
      options: {
        headerShown: false,
      },
    },
    CreateInventoryProductScreen: {
      screen: CreateInventoryProductScreen,
      options: {
        headerShown: false,
      },
    },
    CreateInventoryScreen: {
      screen: CreateInventoryScreen,
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
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
