import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from './home';
import { Inventory } from './inventory';
import { Sell } from './sell';
import { Checkout } from './checkout';
import { Refund } from './refund';
import { AddProductToInventory } from './addProductToInventory';
import { AddInventory } from './addInventory';
import { Products } from './products';
import { AddProductDefinition } from './addProductDefinition';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
    Inventory: {
      screen: Inventory,
      options: {
        headerShown: false,
      },
    },
    Sell: {
      screen: Sell,
      options: {
        headerShown: false,
      },
    },
    Checkout: {
      screen: Checkout,
      options: {
        headerShown: false,
      },
    },
    Refund: {
      screen: Refund,
      options: {
        headerShown: false,
      },
    },
    AddProductDefinition: {
      screen: AddProductDefinition,
      options: {
        headerShown: false,
      },
    },
    AddProductToInventory: {
      screen: AddProductToInventory,
      options: {
        headerShown: false,
      },
    },
    AddInventory: {
      screen: AddInventory,
      options: {
        headerShown: false,
      },
    },
    Products: {
      screen: Products,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
