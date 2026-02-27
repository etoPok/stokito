import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
  Refund: undefined;
  Checkout: undefined;
  AddProductToInventory: undefined;
  AddProductDefinition: undefined;
  AddInventory: undefined;
  Products: undefined;
  SaleDetail: { saleId: string };
  Sales: undefined;
};

export type ScreenNavigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type ScreenRoute<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export function useTypedNavigation<T extends keyof RootStackParamList>() {
  return useNavigation<ScreenNavigation<T>>();
}

export function useTypedRoute<T extends keyof RootStackParamList>() {
  return useRoute<ScreenRoute<T>>();
}
