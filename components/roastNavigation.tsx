import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "./home";
import { Inventory } from "./inventory";
import { Sell } from "./sell";
import { Checkout } from "./checkout";
import { Refund } from "./refund";

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
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
