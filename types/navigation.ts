import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Sell: undefined;
  Inventory: undefined;
  Refund: undefined;
  Checkout: undefined;
  AddProductToInventory: undefined;
  AddProductDefinition: undefined;
  AddInventory: undefined;
  Products: undefined;
};

export type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;
