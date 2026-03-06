import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Product } from '../domain/product';
import { InventoryProduct } from '../domain/inventoryProduct';
import { Inventory } from '../domain/inventory';

export type RootStackParamList = {
  HomeScreen: undefined;
  RefundScreen: undefined;
  CheckoutScreen: undefined;
  ProductsScreen: undefined;
  ConfirmSaleScreen: { saleId: string };
  SalesScreen: undefined;
  InventoryScreen: { inventory: Inventory | undefined };
  ProductScreen: { product: Product | undefined };
  InventoryProductScreen: { inventoryProduct: InventoryProduct | undefined };
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
