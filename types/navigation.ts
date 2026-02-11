import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Sell: undefined;
  Inventory: undefined;
  Refund: undefined;
  Checkout: undefined;
  AddProduct: undefined;
  AddInventory: undefined;
  Products: undefined;
};

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;
